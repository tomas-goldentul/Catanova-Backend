import db from "../../config/db-config.js";

export const getAllVentas = async () => {
	const query = `SELECT * FROM ventas ORDER BY id_venta`;
	const result = await db.query(query);
	return result.rows;
};

// Ventas de una tienda con JOIN a productos para traer el nombre
export const getVentasPorTienda = async (id_tienda) => {
	const query = `
		SELECT
			v.id_venta,
			v.fecha,
			v.cantidad,
			v.precio_unitario,
			v.total,
			v.metodo_pago,
			v.estado,
			v.id_producto,
			v.id_tienda,
			v.id_usuario,
			p.nombre AS nombre_producto,
			p.imagen,
			CASE
				WHEN u.id_usuario IS NOT NULL
				THEN TRIM(u.nombre || ' ' || u.apellido)
				ELSE NULL
			END AS nombre_cliente
		FROM ventas v
		JOIN productos p ON p.id_producto = v.id_producto
		LEFT JOIN usuarios u ON u.id_usuario = v.id_usuario
		WHERE v.id_tienda = $1
		ORDER BY v.fecha DESC
	`;
	const result = await db.query(query, [id_tienda]);
	return result.rows;
};

// Registrar venta y descontar stock en una transacción atómica
export const registrarVentaConStock = async (venta) => {
	const {
		id_producto,
		id_tienda,
		cantidad,
		precio_unitario,
		total,
		metodo_pago,
		id_usuario,
	} = venta;

	const client = await db.connect();
	try {
		await client.query("BEGIN");

		// Verificar stock con bloqueo de fila para evitar race conditions
		const stockResult = await client.query(
			`SELECT stock FROM productos WHERE id_producto = $1 FOR UPDATE`,
			[id_producto]
		);

		if (stockResult.rows.length === 0) {
			throw new Error("El producto no existe");
		}

		const stockActual = Number(stockResult.rows[0].stock);
		if (stockActual < cantidad) {
			throw new Error(
				`Stock insuficiente. Stock disponible: ${stockActual}`
			);
		}

		// Insertar la venta (id_usuario puede ser NULL)
		const ventaResult = await client.query(
			`INSERT INTO ventas
				(id_producto, id_tienda, cantidad, precio_unitario, total, metodo_pago, estado, id_usuario)
			VALUES ($1, $2, $3, $4, $5, $6, 'Completada', $7)
			RETURNING *`,
			[id_producto, id_tienda, cantidad, precio_unitario, total, metodo_pago, id_usuario ?? null]
		);

		// Descontar stock
		await client.query(
			`UPDATE productos SET stock = stock - $1 WHERE id_producto = $2`,
			[cantidad, id_producto]
		);

		await client.query("COMMIT");
		return ventaResult.rows[0];
	} catch (err) {
		await client.query("ROLLBACK");
		throw err;
	} finally {
		client.release();
	}
};

export const getVentaById = async (id_venta) => {
	const query = `SELECT * FROM ventas WHERE id_venta = $1`;
	const result = await db.query(query, [id_venta]);
	return result.rows[0];
};

export const agregarVenta = async (venta) => {
	const {
		fecha,
		id_producto,
		id_tienda,
		id_usuario,
		id_pedido,
		cantidad,
		precio_unitario,
		total
	} = venta;

	const totalComputed = total ?? (cantidad && precio_unitario ? cantidad * precio_unitario : null);

	const query = `
		INSERT INTO ventas (
			fecha,
			id_producto,
			id_tienda,
			id_usuario,
			id_pedido,
			cantidad,
			precio_unitario,
			total
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;
	`;

	const values = [
		fecha,
		id_producto,
		id_tienda,
		id_usuario,
		id_pedido,
		cantidad,
		precio_unitario,
		totalComputed
	];

	const result = await db.query(query, values);
	return result.rows[0];
};

export const editarVenta = async (venta) => {
	const {
		id_venta,
		fecha,
		id_producto,
		id_tienda,
		id_usuario,
		id_pedido,
		cantidad,
		precio_unitario,
		total
	} = venta;

	const totalComputed = total ?? (cantidad && precio_unitario ? cantidad * precio_unitario : null);

	const query = `
		UPDATE ventas SET
			fecha = $1,
			id_producto = $2,
			id_tienda = $3,
			id_usuario = $4,
			id_pedido = $5,
			cantidad = $6,
			precio_unitario = $7,
			total = $8
		WHERE id_venta = $9
		RETURNING *;
	`;

	const values = [
		fecha,
		id_producto,
		id_tienda,
		id_usuario,
		id_pedido,
		cantidad,
		precio_unitario,
		totalComputed,
		id_venta
	];

	const result = await db.query(query, values);
	return result.rows[0];
};

export const eliminarVenta = async (id_venta) => {
	const query = `DELETE FROM ventas WHERE id_venta = $1 RETURNING *`;
	const result = await db.query(query, [id_venta]);
	return result.rows[0];
};

export const getVentasDesdeIntervalo = async (interval) => {
	const query = `SELECT * FROM ventas WHERE fecha >= NOW() - INTERVAL '${interval}' ORDER BY fecha DESC`;
	const result = await db.query(query);
	return result.rows;
};

export const getVentasUltimos7Dias = async () => {
	return await getVentasDesdeIntervalo('7 days');
};

export const getVentasUltimoMes = async () => {
	return await getVentasDesdeIntervalo('1 month');
};

export const getVentasUltimoAno = async () => {
	return await getVentasDesdeIntervalo('1 year');
};

export const getVentasUltimos2Anios = async () => {
	return await getVentasDesdeIntervalo('2 years');
};

export const getCantidadVentasProducto = async (id_producto) => {
    const result = await db.query(
        `SELECT COALESCE(SUM(cantidad), 0) AS cantidad
         FROM ventas
         WHERE id_producto = $1`,
        [id_producto]
    );

    return result.rows[0];
};
