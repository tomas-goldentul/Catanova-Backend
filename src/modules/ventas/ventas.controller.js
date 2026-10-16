import * as ventasModel from "./ventas.model.js";

export const verificarExistenciaVenta = async (id_venta) => {
	const venta = await ventasModel.getVentaById(id_venta);
	if (!venta) {
		throw new Error("La venta no existe");
	}
	return venta;
};

export const insertVenta = async (ventaData) => {
	const {
		id_producto,
		id_tienda,
		cantidad,
		precio_unitario
	} = ventaData;

	// id_usuario e id_pedido son opcionales (ventas manuales/presenciales)
	if (!id_producto || !id_tienda || !cantidad || !precio_unitario) {
		throw new Error("Faltan completar campos obligatorios");
	}

	const venta = { ...ventaData };
	return await ventasModel.agregarVenta(venta);
};

// Registrar venta manual: descuenta stock en transacción atómica
export const registrarVentaManual = async (ventaData) => {
	const { id_producto, id_tienda, cantidad, precio_unitario, metodo_pago, id_usuario } = ventaData;

	if (!id_producto || !id_tienda || !cantidad || !precio_unitario) {
		throw new Error("Faltan completar campos obligatorios");
	}

	const cantidadNum = Number(cantidad);
	const precioNum = Number(precio_unitario);

	if (cantidadNum <= 0) throw new Error("La cantidad debe ser mayor a 0");
	if (precioNum <= 0) throw new Error("El precio unitario debe ser mayor a 0");

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

export const getVentasPorTienda = async (id_tienda) => {
	const ventas = await ventasModel.getVentasPorTienda(id_tienda);
	return ventas; // puede ser array vacío, es válido
};

export const getVentas = async () => {
	const ventas = await ventasModel.getAllVentas();
	if (!ventas || ventas.length === 0) {
		throw new Error("No hay ventas cargadas");
	}
	return ventas;
};

export const getVenta = async (id_venta) => {
	return await verificarExistenciaVenta(id_venta);
};

export const updateVenta = async (ventaData) => {
	const { id_venta } = ventaData;
	await verificarExistenciaVenta(id_venta);
	return await ventasModel.editarVenta(ventaData);
};

export const deleteVenta = async (id_venta) => {
	await verificarExistenciaVenta(id_venta);
	return await ventasModel.eliminarVenta(id_venta);
};

export const getVentasUltimos7Dias = async () => {
	const ventas = await ventasModel.getVentasUltimos7Dias();
	if (!ventas || ventas.length === 0) throw new Error("No hay ventas en los últimos 7 días");
	return ventas;
};

export const getVentasUltimoMes = async () => {
	const ventas = await ventasModel.getVentasUltimoMes();
	if (!ventas || ventas.length === 0) throw new Error("No hay ventas en el último mes");
	return ventas;
};

export const getVentasUltimoAno = async () => {
	const ventas = await ventasModel.getVentasUltimoAno();
	if (!ventas || ventas.length === 0) throw new Error("No hay ventas en el último año");
	return ventas;
};

export const getVentasUltimos2Anios = async () => {
	const ventas = await ventasModel.getVentasUltimos2Anios();
	if (!ventas || ventas.length === 0) throw new Error("No hay ventas en los últimos 2 años");
	return ventas;
};

export const getCantidadVentasProducto = async (id_producto) => {
    return await ventasModel.getCantidadVentasProducto(id_producto);
};