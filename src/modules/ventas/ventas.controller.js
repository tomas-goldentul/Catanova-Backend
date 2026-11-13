
import * as ventasModel from "./ventas.model.js";
import { crearError, verificarDuenioTienda } from "../auth/auth.middleware.js";

// Devuelve la venta solo si pertenece a la tienda del token.
const obtenerVentaPropia = async (id_venta, usuarioToken) => {
	verificarDuenioTienda(usuarioToken, usuarioToken?.id_tienda);

	const venta = await ventasModel.getVentaById(id_venta);

	if (!venta) {
		throw crearError("La venta no existe", 404);
	}

	verificarDuenioTienda(usuarioToken, venta.id_tienda);
	return venta;
};

// Valida los productos recibidos para registrar una venta.
const validarProductosVenta = (productos) => {
	const items = Array.isArray(productos)
		? productos
		: Array.isArray(productos?.detalles)
			? productos.detalles
			: productos;

	if (!Array.isArray(items) || items.length === 0) {
		throw crearError("La venta debe tener al menos un producto.", 400);
	}

	const ids = new Set();

	return items.map((producto) => {
		const id_producto = Number(producto.id_producto);
		const cantidad = Number(producto.cantidad);
		const precio_unitario = Number(producto.precio_unitario);

		if (!Number.isInteger(id_producto) || id_producto <= 0) {
			throw crearError("El id del producto no es válido.", 400);
		}

		if (!Number.isInteger(cantidad) || cantidad <= 0) {
			throw crearError("La cantidad debe ser un número entero mayor a 0.", 400);
		}

		if (!Number.isFinite(precio_unitario) || precio_unitario < 0) {
			throw crearError("El precio unitario no es válido.", 400);
		}

		if (ids.has(id_producto)) {
			throw crearError("No se puede repetir un producto en la venta.", 400);
		}

		ids.add(id_producto);

		return {
			id_producto,
			cantidad,
			precio_unitario,
		};
	});
};

const obtenerItemsVenta = (ventaData) => ventaData?.productos ?? ventaData?.detalles ?? [];

// Registra una venta con varios productos.
export const insertVenta = async (ventaData, usuarioToken) => {
	const id_tienda = Number(ventaData.id_tienda ?? usuarioToken?.id_tienda);

	verificarDuenioTienda(usuarioToken, id_tienda);

	const productos = validarProductosVenta(obtenerItemsVenta(ventaData));

	return await ventasModel.agregarVenta({
		...ventaData,
		id_tienda,
		id_usuario: ventaData.id_usuario
			? Number(ventaData.id_usuario)
			: null,
		id_pedido: ventaData.id_pedido
			? Number(ventaData.id_pedido)
			: null,
		productos,
	});
};

// Registrar venta manual: descuenta el stock de todos los productos.
export const registrarVentaManual = async (ventaData, usuarioToken) => {
	const id_tienda = Number(ventaData.id_tienda ?? usuarioToken?.id_tienda);

	verificarDuenioTienda(usuarioToken, id_tienda);

	const productos = validarProductosVenta(obtenerItemsVenta(ventaData));

	return await ventasModel.registrarVentaConStock({
		id_tienda,
		id_usuario: ventaData.id_usuario
			? Number(ventaData.id_usuario)
			: null,
		id_pedido: ventaData.id_pedido
			? Number(ventaData.id_pedido)
			: null,
		fecha: ventaData.fecha,
		metodo_pago: ventaData.metodo_pago || null,
		productos,
	});
};

// Valida YYYY-MM-DD y que sea una fecha real.
const parsearDiaQuery = (valor, nombre) => {
	if (valor === undefined || valor === "") return undefined;

	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(valor));
	const fecha = m && new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));

	if (
		!m ||
		fecha.getUTCFullYear() !== +m[1] ||
		fecha.getUTCMonth() !== +m[2] - 1 ||
		fecha.getUTCDate() !== +m[3]
	) {
		throw crearError(
			`'${nombre}' inválido. Formato esperado: YYYY-MM-DD.`,
			400
		);
	}

	return m[0];
};

// Ventas de una tienda con filtros opcionales.
export const getVentasPorTienda = async (
	id_tienda,
	usuarioToken,
	filtros = {}
) => {
	verificarDuenioTienda(usuarioToken, id_tienda);

	const desde = parsearDiaQuery(filtros.desde, "desde");
	const hasta = parsearDiaQuery(filtros.hasta, "hasta");

	if (desde && hasta && desde >= hasta) {
		throw crearError(
			"'desde' tiene que ser anterior a 'hasta'.",
			400
		);
	}

	return await ventasModel.getVentasPorTienda(id_tienda, {
		desde,
		hasta,
	});
};

export const getVenta = async (id_venta, usuarioToken) => {
	return await obtenerVentaPropia(id_venta, usuarioToken);
};

// Edición parcial de los datos generales de una venta.
// Los productos y sus cantidades no se modifican desde esta función.
export const updateVenta = async (ventaData, usuarioToken) => {
	const { id_venta } = ventaData;

	if (!id_venta) {
		throw crearError("Falta el id_venta.", 400);
	}

	const actual = await obtenerVentaPropia(id_venta, usuarioToken);

	const camposPermitidos = ["fecha", "metodo_pago", "estado"];

	const cambios = Object.fromEntries(
		Object.entries(ventaData).filter(
			([campo, valor]) =>
				camposPermitidos.includes(campo) && valor !== undefined
		)
	);

	if (Object.keys(cambios).length === 0) {
		throw crearError("No se enviaron campos para modificar.", 400);
	}

	return await ventasModel.editarVenta({
		...cambios,
		id_venta: actual.id_venta,
	});
};

export const deleteVenta = async (id_venta, usuarioToken) => {
	await obtenerVentaPropia(id_venta, usuarioToken);
	return await ventasModel.eliminarVenta(id_venta);
};

export const getCantidadVentasProducto = async (id_producto) => {
	return await ventasModel.getCantidadVentasProducto(id_producto);
};

export const crearPedidoDesdeVenta = async (id_venta, data, usuarioToken) => {
	if (!id_venta) throw crearError("Falta el id_venta.", 400);
	const venta = await obtenerVentaPropia(id_venta, usuarioToken);
	const direccion = String(data?.direccion ?? "").trim();
	if (!direccion) throw crearError("La dirección es obligatoria para crear el pedido.", 400);

	const resultado = await ventasModel.crearPedidoDesdeVenta({
		id_venta: venta.id_venta,
		id_tienda: venta.id_tienda,
		direccion,
		metodo_pago: data?.metodo_pago ?? venta.metodo_pago ?? null,
	});
	return { success: true, message: "Pedido creado y asociado a la venta.", ...resultado };
};
