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
		fecha,
		id_producto,
		id_tienda,
		id_usuario,
		cantidad,
		precio_unitario
	} = ventaData;

	if (!fecha || !id_producto || !id_tienda || !id_usuario || !cantidad || !precio_unitario) {
		throw new Error("Faltan completar campos obligatorios");
	}

	const venta = {
		...ventaData
	};

	return await ventasModel.agregarVenta(venta);
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

