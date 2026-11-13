
import db from "../../config/db-config.js";

const FECHA_A_SESION =
	"($1::timestamptz AT TIME ZONE current_setting('TimeZone'))";

const TZ_ARGENTINA = "America/Argentina/Buenos_Aires";

const inicioDiaArgentina = (param) =>
	`((${param}::date::timestamp AT TIME ZONE '${TZ_ARGENTINA}') AT TIME ZONE current_setting('TimeZone'))`;

export const getTiendaDeProducto = async (id_producto) => {
	const result = await db.query(
		`SELECT id_tienda FROM productos WHERE id_producto = $1`,
		[id_producto]
	);
	return result.rows[0];
};

// Obtener ventas de una tienda, incluyendo todos sus productos.
export const getVentasPorTienda = async (
	id_tienda,
	{ desde, hasta } = {}
) => {
	const values = [id_tienda];
	let filtroFecha = "";

	if (desde) {
		values.push(desde);
		filtroFecha += ` AND v.fecha >= ${inicioDiaArgentina(`$${values.length}`)}`;
	}

	if (hasta) {
		values.push(hasta);
		filtroFecha += ` AND v.fecha < ${inicioDiaArgentina(`$${values.length}`)}`;
	}

	const query = `
		SELECT
			v.id_venta,
			v.fecha,
			v.total,
			v.metodo_pago,
			v.estado,
			v.id_tienda,
			v.id_usuario,
			v.id_pedido,

			CASE
				WHEN u.id_usuario IS NOT NULL
				THEN TRIM(u.nombre || ' ' || u.apellido)
				ELSE NULL
			END AS nombre_cliente,

			COALESCE(
				(
					SELECT json_agg(
						json_build_object(
							'id_detalleventa', dv.id_detalleventa,
							'id_producto', p.id_producto,
							'nombre_producto', p.nombre,
							'imagen', p.imagen,
							'cantidad', dv.cantidad,
							'precio_unitario', dv.precio_unitario,
							'subtotal', dv.subtotal
						)
					)
					FROM detalleventas dv
					JOIN productos p
						ON p.id_producto = dv.id_producto
					WHERE dv.id_venta = v.id_venta
				),
				'[]'::json
			) AS detalles,
			COALESCE(
				(
					SELECT json_agg(
						json_build_object(
							'id_detalleventa', dv.id_detalleventa,
							'id_producto', p.id_producto,
							'nombre_producto', p.nombre,
							'imagen', p.imagen,
							'cantidad', dv.cantidad,
							'precio_unitario', dv.precio_unitario,
							'subtotal', dv.subtotal
						)
					)
					FROM detalleventas dv
					JOIN productos p
						ON p.id_producto = dv.id_producto
					WHERE dv.id_venta = v.id_venta
				),
				'[]'::json
			) AS productos

		FROM ventas v
		LEFT JOIN usuarios u
			ON u.id_usuario = v.id_usuario

		WHERE v.id_tienda = $1${filtroFecha}
		ORDER BY v.fecha DESC
	`;

	const result = await db.query(query, values);
	return result.rows;
};

// Registrar una venta con varios productos y descontar el stock.
export const registrarVentaConStock = async (venta) => {
	const {
		productos,
		id_tienda,
		metodo_pago,
		id_usuario,
		id_pedido,
		fecha
	} = venta;

	if (!Array.isArray(productos) || productos.length === 0) {
		throw new Error("La venta debe contener al menos un producto.");
	}

	if (!id_tienda) {
		throw new Error("Falta indicar la tienda.");
	}

	// Validar productos y evitar productos repetidos.
	const ids = new Set();

	for (const producto of productos) {
		const id = Number(producto.id_producto);
		const cantidad = Number(producto.cantidad);
		const precio = Number(producto.precio_unitario);

		if (!Number.isInteger(id) || id <= 0) {
			throw new Error("ID de producto inválido.");
		}

		if (!Number.isInteger(cantidad) || cantidad <= 0) {
			throw new Error("La cantidad debe ser un entero mayor a cero.");
		}

		if (!Number.isFinite(precio) || precio < 0) {
			throw new Error("El precio unitario no es válido.");
		}

		if (ids.has(id)) {
			throw new Error("No se puede repetir un producto en la venta.");
		}

		ids.add(id);
	}

	const total = productos.reduce(
		(suma, producto) =>
			suma +
			Number(producto.cantidad) *
			Number(producto.precio_unitario),
		0
	);

	const client = await db.connect();

	try {
		await client.query("BEGIN");

		// Bloquear los productos para evitar problemas de stock simultáneos.
		const idsProductos = productos
			.map((p) => Number(p.id_producto))
			.sort((a, b) => a - b);

		const stockResult = await client.query(
			`
				SELECT id_producto, stock, id_tienda
				FROM productos
				WHERE id_producto = ANY($1::integer[])
				ORDER BY id_producto
				FOR UPDATE
			`,
			[idsProductos]
		);

		if (stockResult.rows.length !== productos.length) {
			throw new Error("Uno o más productos no existen.");
		}

		const productosBD = new Map(
			stockResult.rows.map((p) => [
				Number(p.id_producto),
				p
			])
		);

		// Verificar tienda y stock de cada producto.
		for (const producto of productos) {
			const productoBD = productosBD.get(
				Number(producto.id_producto)
			);

			if (Number(productoBD.id_tienda) !== Number(id_tienda)) {
				const error = new Error(
					"Uno de los productos no pertenece a tu tienda."
				);
				error.status = 403;
				throw error;
			}

			const stockActual = Number(productoBD.stock);

			if (stockActual < Number(producto.cantidad)) {
				throw new Error(
					`Stock insuficiente para el producto ${producto.id_producto}. Disponible: ${stockActual}`
				);
			}
		}

		// Crear la cabecera de la venta.
		const ventaResult = await client.query(
			`
				INSERT INTO ventas (
					fecha,
					id_tienda,
					id_usuario,
					id_pedido,
					total,
					metodo_pago,
					estado
				)
				VALUES (
					COALESCE(${FECHA_A_SESION}, LOCALTIMESTAMP),
					$2, $3, $4, $5, $6, 'Completada'
				)
				RETURNING *
			`,
			[
				fecha || null,
				id_tienda,
				id_usuario ?? null,
				id_pedido ?? null,
				total,
				metodo_pago ?? null
			]
		);

		const ventaCreada = ventaResult.rows[0];

		// Crear los detalles y descontar el stock.
		for (const producto of productos) {
			const cantidad = Number(producto.cantidad);
			const precio = Number(producto.precio_unitario);
			const subtotal = cantidad * precio;

			await client.query(
				`
					INSERT INTO detalleventas (
						id_venta,
						id_producto,
						cantidad,
						precio_unitario,
						subtotal
					)
					VALUES ($1, $2, $3, $4, $5)
				`,
				[
					ventaCreada.id_venta,
					producto.id_producto,
					cantidad,
					precio,
					subtotal
				]
			);

			await client.query(
				`
					UPDATE productos
					SET stock = stock - $1
					WHERE id_producto = $2
				`,
				[cantidad, producto.id_producto]
			);
		}

		await client.query("COMMIT");

		const detalles = productos.map((producto) => ({
			id_producto: Number(producto.id_producto),
			cantidad: Number(producto.cantidad),
			precio_unitario: Number(producto.precio_unitario),
			subtotal: Number(producto.cantidad) * Number(producto.precio_unitario),
		}));

		return {
			...ventaCreada,
			detalles,
			productos: detalles,
		};

	} catch (err) {
		await client.query("ROLLBACK");
		throw err;
	} finally {
		client.release();
	}
};

// Obtener una venta con todos sus productos.
export const getVentaById = async (id_venta) => {
	const query = `
		SELECT
			v.*,
			COALESCE(
				(
					SELECT json_agg(
						json_build_object(
							'id_detalleventa', dv.id_detalleventa,
							'id_producto', p.id_producto,
							'nombre_producto', p.nombre,
							'imagen', p.imagen,
							'cantidad', dv.cantidad,
							'precio_unitario', dv.precio_unitario,
							'subtotal', dv.subtotal
						)
					)
					FROM detalleventas dv
					JOIN productos p
						ON p.id_producto = dv.id_producto
					WHERE dv.id_venta = v.id_venta
				),
				'[]'::json
			) AS detalles,
			COALESCE(
				(
					SELECT json_agg(
						json_build_object(
							'id_detalleventa', dv.id_detalleventa,
							'id_producto', p.id_producto,
							'nombre_producto', p.nombre,
							'imagen', p.imagen,
							'cantidad', dv.cantidad,
							'precio_unitario', dv.precio_unitario,
							'subtotal', dv.subtotal
						)
					)
					FROM detalleventas dv
					JOIN productos p
						ON p.id_producto = dv.id_producto
					WHERE dv.id_venta = v.id_venta
				),
				'[]'::json
			) AS productos
		FROM ventas v
		WHERE v.id_venta = $1
	`;

	const result = await db.query(query, [id_venta]);
	return result.rows[0];
};

// Mantener este nombre para los lugares que ya utilizan agregarVenta.
// Ahora debe recibir productos como array.
export const agregarVenta = async (venta) => {
	return await registrarVentaConStock(venta);
};

// Editar datos generales de una venta.
// No modifica sus productos ni su stock.
export const editarVenta = async (venta) => {
	const {
		id_venta,
		fecha,
		metodo_pago,
		estado
	} = venta;

	const query = `
		UPDATE ventas SET
			fecha = COALESCE(${FECHA_A_SESION}, fecha),
			metodo_pago = COALESCE($2, metodo_pago),
			estado = COALESCE($3, estado)
		WHERE id_venta = $4
		RETURNING *
	`;

	const result = await db.query(query, [
		fecha || null,
		metodo_pago ?? null,
		estado ?? null,
		id_venta
	]);

	return result.rows[0];
};

// Eliminar venta y devolver al stock los productos vendidos.
export const eliminarVenta = async (id_venta) => {
	const client = await db.connect();

	try {
		await client.query("BEGIN");

		const detalles = await client.query(
			`
				SELECT id_producto, cantidad
				FROM detalleventas
				WHERE id_venta = $1
				ORDER BY id_producto
				FOR UPDATE
			`,
			[id_venta]
		);

		for (const detalle of detalles.rows) {
			await client.query(
				`
					UPDATE productos
					SET stock = stock + $1
					WHERE id_producto = $2
				`,
				[detalle.cantidad, detalle.id_producto]
			);
		}

		const result = await client.query(
			`DELETE FROM ventas WHERE id_venta = $1 RETURNING *`,
			[id_venta]
		);

		await client.query("COMMIT");
		return result.rows[0];

	} catch (err) {
		await client.query("ROLLBACK");
		throw err;
	} finally {
		client.release();
	}
};

// Cantidad total vendida de un producto.
export const getCantidadVentasProducto = async (id_producto) => {
	const result = await db.query(
		`
			SELECT COALESCE(SUM(cantidad), 0) AS cantidad
			FROM detalleventas
			WHERE id_producto = $1
		`,
		[id_producto]
	);

	return result.rows[0];
};

// Crea un pedido a partir de una venta existente (sin modificar stock) y lo vincula a la venta.
export const crearPedidoDesdeVenta = async ({ id_venta, id_tienda, direccion, metodo_pago }) => {
	const client = await db.connect();
	try {
		await client.query("BEGIN");

		const ventaRes = await client.query(
			`SELECT id_venta, id_tienda, id_usuario, id_pedido, metodo_pago, total
			 FROM ventas WHERE id_venta = $1 FOR UPDATE`,
			[id_venta]
		);
		const venta = ventaRes.rows[0];
		if (!venta) throw Object.assign(new Error("La venta no existe."), { status: 404 });
		if (Number(venta.id_tienda) !== Number(id_tienda)) {
			throw Object.assign(new Error("No tenés permiso para acceder a los datos de otra tienda."), { status: 403 });
		}
		if (venta.id_pedido) {
			throw Object.assign(new Error("La venta ya tiene un pedido asociado."), { status: 409 });
		}

		const detallesRes = await client.query(
			`SELECT dv.id_producto, dv.cantidad, dv.precio_unitario, dv.subtotal
			 FROM detalleventas dv
			 WHERE dv.id_venta = $1
			 ORDER BY dv.id_detalleventa ASC`,
			[id_venta]
		);
		const detalles = detallesRes.rows;
		if (detalles.length === 0) {
			throw Object.assign(new Error("La venta no tiene productos para generar un pedido."), { status: 400 });
		}

		const metodo = metodo_pago ?? venta.metodo_pago ?? null;
		const pedidoRes = await client.query(
			`INSERT INTO pedidos (fecha, direccion, id_usuario, entregado, metodo_pago, estado)
			 VALUES (CURRENT_DATE, $1, $2, false, $3, 'Pendiente')
			 RETURNING id_pedido`,
			[direccion, venta.id_usuario ?? null, metodo]
		);
		const id_pedido = pedidoRes.rows[0].id_pedido;

		// Registrar historial inicial si la tabla existe
		await client.query(
			`INSERT INTO pedidos_historial_estado (id_pedido, estado)
			 SELECT $1, 'Pendiente'
			 WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='pedidos_historial_estado')`,
			[id_pedido]
		).catch(() => {});

		for (const d of detalles) {
			const precioTotal = Number(d.subtotal ?? (Number(d.cantidad) * Number(d.precio_unitario)));
			await client.query(
				`INSERT INTO detallepedidos (cantidad, precio_total, id_pedido, id_producto)
				 VALUES ($1, $2, $3, $4)`,
				[Number(d.cantidad), precioTotal, id_pedido, Number(d.id_producto)]
			);
		}

		await client.query(
			`UPDATE ventas SET id_pedido = $1 WHERE id_venta = $2`,
			[id_pedido, id_venta]
		);

		await client.query("COMMIT");
		return { id_venta: Number(id_venta), id_pedido: Number(id_pedido) };
	} catch (err) {
		await client.query("ROLLBACK");
		throw err;
	} finally {
		client.release();
	}
};
