import * as ventasModel from "./ventas.model.js";
import { crearError, verificarDuenioTienda } from "../auth/auth.middleware.js";

// Devuelve la venta solo si pertenece a la tienda del token (404 si no existe, 403 si es de otra tienda).
const obtenerVentaPropia = async (id_venta, usuarioToken) => {
	verificarDuenioTienda(usuarioToken, usuarioToken?.id_tienda);
	const venta = await ventasModel.getVentaById(id_venta);
	if (!venta) {
		throw crearError("La venta no existe", 404);
	}
	verificarDuenioTienda(usuarioToken, venta.id_tienda);
	return venta;
};

const verificarProductoDeTienda = async (id_producto, id_tienda) => {
	const producto = await ventasModel.getTiendaDeProducto(id_producto);
	if (!producto) {
		throw crearError("El producto no existe", 400);
	}
	if (Number(producto.id_tienda) !== Number(id_tienda)) {
		throw crearError("El producto no pertenece a tu tienda.", 403);
	}
};

export const insertVenta = async (ventaData, usuarioToken) => {
	const id_tienda = ventaData.id_tienda ?? usuarioToken?.id_tienda;
	verificarDuenioTienda(usuarioToken, id_tienda);

	const { id_producto, cantidad, precio_unitario } = ventaData;
	// id_usuario e id_pedido son opcionales (ventas manuales/presenciales)
	if (!id_producto || !cantidad || !precio_unitario) {
		throw crearError("Faltan completar campos obligatorios", 400);
	}

	await verificarProductoDeTienda(id_producto, id_tienda);
	return await ventasModel.agregarVenta({ ...ventaData, id_tienda });
};

// Registrar venta manual: descuenta stock en transacción atómica
export const registrarVentaManual = async (ventaData, usuarioToken) => {
	const id_tienda = ventaData.id_tienda ?? usuarioToken?.id_tienda;
	verificarDuenioTienda(usuarioToken, id_tienda);

	const { id_producto, cantidad, precio_unitario, metodo_pago, id_usuario } = ventaData;

	if (!id_producto || !cantidad || !precio_unitario) {
		throw crearError("Faltan completar campos obligatorios", 400);
	}

	const cantidadNum = Number(cantidad);
	const precioNum = Number(precio_unitario);

	if (cantidadNum <= 0) throw crearError("La cantidad debe ser mayor a 0", 400);
	if (precioNum <= 0) throw crearError("El precio unitario debe ser mayor a 0", 400);

	const total = cantidadNum * precioNum;

	return await ventasModel.registrarVentaConStock({
		id_producto: Number(id_producto),
		id_tienda: Number(id_tienda),
		cantidad: cantidadNum,
		precio_unitario: precioNum,
		total,
		metodo_pago: metodo_pago || null,
		id_usuario: id_usuario ? Number(id_usuario) : null,
	});
};

export const getVentasPorTienda = async (id_tienda, usuarioToken) => {
	verificarDuenioTienda(usuarioToken, id_tienda);
	return await ventasModel.getVentasPorTienda(id_tienda); // puede ser array vacío, es válido
};

export const getVenta = async (id_venta, usuarioToken) => {
	return await obtenerVentaPropia(id_venta, usuarioToken);
};

// Edición parcial: los campos que no vienen en el body conservan su valor actual.
export const updateVenta = async (ventaData, usuarioToken) => {
	const { id_venta } = ventaData;
	if (!id_venta) {
		throw crearError("Falta el id_venta", 400);
	}

	const actual = await obtenerVentaPropia(id_venta, usuarioToken);
	const cambios = Object.fromEntries(Object.entries(ventaData).filter(([, valor]) => valor !== undefined));
	const venta = { ...actual, ...cambios };

	// Si cambia la cantidad o el precio y no mandan total, se recalcula.
	if ((cambios.cantidad !== undefined || cambios.precio_unitario !== undefined) && cambios.total === undefined) {
		venta.total = Number(venta.cantidad) * Number(venta.precio_unitario);
	}

	verificarDuenioTienda(usuarioToken, venta.id_tienda);
	if (Number(venta.id_producto) !== Number(actual.id_producto)) {
		await verificarProductoDeTienda(venta.id_producto, venta.id_tienda);
	}

	return await ventasModel.editarVenta(venta);
};

export const deleteVenta = async (id_venta, usuarioToken) => {
	await obtenerVentaPropia(id_venta, usuarioToken);
	return await ventasModel.eliminarVenta(id_venta);
};

export const getCantidadVentasProducto = async (id_producto) => {
	return await ventasModel.getCantidadVentasProducto(id_producto);
};
