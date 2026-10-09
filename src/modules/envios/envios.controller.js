import * as enviosModel from "./envios.model.js";
import * as pedidosModel from "../pedidos/pedidos.model.js";

const crearError = (mensaje, status) => {
  const error = new Error(mensaje);
  error.status = status;
  return error;
};

// Formato tipo correo: RT + 9 dígitos + AR (ej: RT123456789AR).
const generarCodigoSeguimiento = () => {
  const numero = Math.floor(Math.random() * 1e9).toString().padStart(9, "0");
  return `RT${numero}AR`;
};

const verificarPedidoDeTienda = async (id_pedido, usuarioToken) => {
  if (usuarioToken?.tipo !== "tienda" || !usuarioToken.id_tienda) {
    throw crearError("Solo una tienda puede gestionar envíos.", 403);
  }

  const pedidoDB = await pedidosModel.getPedidoById(id_pedido);
  if (!pedidoDB) {
    throw crearError(`El pedido con ID ${id_pedido} no existe.`, 404);
  }

  const esDeLaTienda = await pedidosModel.pedidoTieneProductosDeTienda(id_pedido, usuarioToken.id_tienda);
  if (!esDeLaTienda) {
    throw crearError("El pedido no pertenece a tu tienda.", 403);
  }

  return pedidoDB;
};

const validarLargos = (campos) => {
  for (const [campo, valor] of Object.entries(campos)) {
    if (valor !== undefined && valor !== null && String(valor).trim().length > 100) {
      throw crearError(`El campo '${campo}' admite como máximo 100 caracteres.`, 400);
    }
  }
};

// Pedidos de la tienda logueada, con o sin envío (id_envio en null si no tiene).
export const listarEnviosTienda = async (usuarioToken) => {
  if (usuarioToken?.tipo !== "tienda" || !usuarioToken.id_tienda) {
    throw crearError("Solo una tienda puede ver sus envíos.", 403);
  }

  const filas = await enviosModel.listarPedidosDeTienda(usuarioToken.id_tienda);
  return filas.map(fila => ({
    id_pedido: fila.id_pedido,
    estado: fila.estado,
    fecha_pedido: fila.fecha_pedido,
    id_envio: fila.id_envio,
    codigo_seguimiento: fila.codigo_seguimiento,
    fecha_creacion: fila.fecha_creacion,
    repartidor: fila.repartidor,
    nombre_comprador: fila.nombre_comprador,
    direccion: fila.direccion,
    cantidad_productos: Number(fila.cantidad_productos),
    total: Number(fila.total),
    puede_crear_envio: !fila.id_envio && (fila.estado === "Pendiente" || fila.estado === "En preparación")
  }));
};

export const editarEnvio = async (id_envio, datos, usuarioToken) => {
  const envio = await enviosModel.getEnvioById(id_envio);
  if (!envio) {
    throw crearError(`El envío con ID ${id_envio} no existe.`, 404);
  }

  const pedidoDB = await verificarPedidoDeTienda(envio.id_pedido, usuarioToken);
  if (pedidoDB.entregado) {
    throw crearError("No se puede editar el envío de un pedido ya entregado.", 409);
  }

  const { direccion, nombre_comprador, repartidor } = datos || {};
  validarLargos({ direccion, nombre_comprador, repartidor });

  // Solo se cambian los campos enviados; no se aceptan vacíos.
  const cambios = { direccion, nombre_comprador, repartidor };
  for (const [campo, valor] of Object.entries(cambios)) {
    if (valor === undefined) continue;
    if (valor === null || !String(valor).trim()) {
      throw crearError(`El campo '${campo}' no puede quedar vacío.`, 400);
    }
  }

  return await enviosModel.editarEnvio({
    id_envio: Number(id_envio),
    direccion: direccion !== undefined ? String(direccion).trim() : envio.direccion,
    nombre_comprador: nombre_comprador !== undefined ? String(nombre_comprador).trim() : envio.nombre_comprador,
    repartidor: repartidor !== undefined ? String(repartidor).trim() : envio.repartidor
  });
};

export const crearEnvio = async (datos, usuarioToken) => {
  const { id_pedido, direccion, nombre_comprador, repartidor } = datos || {};

  if (!id_pedido) {
    throw crearError("El campo 'id_pedido' es obligatorio.", 400);
  }
  if (!repartidor || !String(repartidor).trim()) {
    throw crearError("El campo 'repartidor' es obligatorio.", 400);
  }

  validarLargos({ direccion, nombre_comprador, repartidor });

  const pedidoDB = await verificarPedidoDeTienda(id_pedido, usuarioToken);

  if (pedidoDB.estado !== "Pendiente" && pedidoDB.estado !== "En preparación") {
    throw crearError(`No se puede crear un envío para un pedido en estado '${pedidoDB.estado}'.`, 409);
  }
  if (await enviosModel.getEnvioPorPedido(id_pedido)) {
    throw crearError(`El pedido ${id_pedido} ya tiene un envío creado.`, 409);
  }

  // Por defecto se usan la dirección y el nombre del comprador del pedido.
  const filas = await pedidosModel.getPedidoConDetallesById(id_pedido);
  const nombrePedido = `${filas[0]?.nombre_usuario || ""} ${filas[0]?.apellido_usuario || ""}`.trim();

  let codigo_seguimiento = generarCodigoSeguimiento();
  while (await enviosModel.getEnvioPorCodigo(codigo_seguimiento)) {
    codigo_seguimiento = generarCodigoSeguimiento();
  }

  const envio = await enviosModel.crearEnvio({
    id_pedido: Number(id_pedido),
    codigo_seguimiento,
    direccion: direccion && String(direccion).trim() ? String(direccion).trim() : pedidoDB.direccion,
    nombre_comprador: nombre_comprador && String(nombre_comprador).trim() ? String(nombre_comprador).trim() : nombrePedido,
    repartidor: String(repartidor).trim()
  });

  await pedidosModel.cambiarEstado(id_pedido, "Enviado");

  return envio;
};

export const getEnvioPorPedido = async (id_pedido, usuarioToken) => {
  await verificarPedidoDeTienda(id_pedido, usuarioToken);

  const envio = await enviosModel.getEnvioPorPedido(id_pedido);
  if (!envio) {
    throw crearError(`El pedido ${id_pedido} no tiene envío.`, 404);
  }
  return envio;
};

export const eliminarEnvio = async (id_envio, usuarioToken) => {
  const envio = await enviosModel.getEnvioById(id_envio);
  if (!envio) {
    throw crearError(`El envío con ID ${id_envio} no existe.`, 404);
  }

  const pedidoDB = await verificarPedidoDeTienda(envio.id_pedido, usuarioToken);
  if (pedidoDB.entregado) {
    throw crearError("No se puede eliminar el envío de un pedido ya entregado.", 409);
  }

  await enviosModel.eliminarEnvio(id_envio);

  // El pedido vuelve al último estado que tuvo antes de enviarse.
  const historial = await pedidosModel.getHistorialEstados(envio.id_pedido);
  const indiceEnviado = historial.map(h => h.estado).lastIndexOf("Enviado");
  const previo = indiceEnviado > 0 ? historial[indiceEnviado - 1].estado : null;
  const estadoPrevio = previo === "En preparación" ? previo : "Pendiente";
  await pedidosModel.cambiarEstado(envio.id_pedido, estadoPrevio);

  return {
    success: true,
    estado: estadoPrevio,
    message: `Envío ${envio.codigo_seguimiento} eliminado. El pedido ${envio.id_pedido} volvió a "${estadoPrevio}".`
  };
};
