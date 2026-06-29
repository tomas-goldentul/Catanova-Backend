import db from "../../config/db-config.js";

export const getAllVentas = async () => {
	const query = `SELECT * FROM ventas ORDER BY id_venta`;
	const result = await db.query(query);
	return result.rows;
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

