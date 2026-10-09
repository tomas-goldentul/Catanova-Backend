import * as pedidosModel from "./pedidos.model.js";
import { getProductosId, restarStockProducto, sumarStockProducto } from "../productos/productos.model.js";
import { insertarDetallePedido } from "../detallepedidos/detallepedidos.model.js";
import { getUsuarioPorCuenta } from "../usuarios/usuarios.model.js";
import { getEnvioPorPedido } from "../envios/envios.model.js";

export const ESTADOS_PEDIDO = ["Pendiente", "En preparación", "Enviado", "Entregado"];

const crearError = (mensaje, status) => {
  const error = new Error(mensaje);
  error.status = status;
  return error;
};

const normalizarPedido = (filas) => {
  if (!filas || filas.length === 0) return [];

  const primerFila = filas[0];
  const pedido = {
    id_pedido: primerFila.id_pedido,
    id_usuario: primerFila.id_usuario,
    fecha: primerFila.fecha,
    direccion: primerFila.direccion,
    entregado: primerFila.entregado,
    estado: primerFila.estado,
    envio: primerFila.id_envio
      ? { id_envio: primerFila.id_envio, codigo_seguimiento: primerFila.codigo_seguimiento, repartidor: primerFila.repartidor }
      : null,
    metodo_pago: primerFila.metodo_pago,
    nombre_usuario: primerFila.nombre_usuario || null,
    apellido_usuario: primerFila.apellido_usuario || null,
    detalles: filas
      .filter(fila => fila.id_detallepedido !== null)
      .map(fila => ({
        id_detallepedido: fila.id_detallepedido,
        id_producto: fila.id_producto,
        cantidad: fila.cantidad,
        precio_total: Number(fila.precio_total),
        nombre_producto: fila.nombre_producto || null,
        precio_unitario: fila.precio_unitario !== null ? Number(fila.precio_unitario) : null,
        id_tienda: fila.id_tienda_producto !== null ? Number(fila.id_tienda_producto) : null,
        nombre_tienda: fila.nombre_tienda || null
      }))
  };

  return [pedido];
};

const agruparPedidos = (filas) => {
  return filas.reduce((acc, current) => {
    const pedidoExistente = acc.find(p => p.id_pedido === current.id_pedido);
    const detalle = current.id_detallepedido ? {
      id_detallepedido: current.id_detallepedido,
      id_producto: current.id_producto,
      cantidad: current.cantidad,
      precio_total: Number(current.precio_total),
      nombre_producto: current.nombre_producto || null,
      precio_unitario: current.precio_unitario !== null ? Number(current.precio_unitario) : null,
      id_tienda: current.id_tienda_producto !== null ? Number(current.id_tienda_producto) : null,
      nombre_tienda: current.nombre_tienda || null
    } : null;

    if (pedidoExistente) {
      if (detalle) {
        pedidoExistente.detalles.push(detalle);
      }
    } else {
      acc.push({
        id_pedido: current.id_pedido,
        id_usuario: current.id_usuario,
        fecha: current.fecha,
        direccion: current.direccion,
        entregado: current.entregado,
        estado: current.estado,
        envio: current.id_envio
          ? { id_envio: current.id_envio, codigo_seguimiento: current.codigo_seguimiento, repartidor: current.repartidor }
          : null,
        metodo_pago: current.metodo_pago,
        nombre_usuario: current.nombre_usuario || null,
        apellido_usuario: current.apellido_usuario || null,
        detalles: detalle ? [detalle] : []
      });
    }

    return acc;
  }, []);
};

export const procesarNuevoPedido = async (datosPedido) => {
  const { id_usuario, direccion, metodo_pago, productos } = datosPedido;

  if (!id_usuario || !direccion || !metodo_pago || !productos || productos.length === 0) {
    throw new Error("Faltan datos obligatorios para crear el pedido.");
  }

  for (const item of productos) {
    const productoDB = await getProductosId(item.id_producto);

    if (!productoDB) {
      throw new Error(`El producto con ID ${item.id_producto} no existe.`);
    }

    if (productoDB.stock < item.cantidad) {
      throw new Error(`Stock insuficiente para ${productoDB.nombre}. Disponible: ${productoDB.stock}`);
    }

    item.precioReal = productoDB.precio;
  }

  const id_pedido = await pedidosModel.insertarPedidoBase(direccion, id_usuario, metodo_pago);

  for (const item of productos) {
    const precioTotalItem = Number(item.precioReal) * item.cantidad;

    await insertarDetallePedido(item.cantidad, precioTotalItem, id_pedido, item.id_producto);

    await restarStockProducto(item.id_producto, item.cantidad);
  }

  return {
    success: true,
    id_pedido,
    message: "Pedido procesado y stock actualizado con éxito."
  };
};

export const getAllPedidos = async () => {
  const filas = await pedidosModel.getAllPedidosConDetalles();
  if (filas.length === 0) {
    throw new Error("No hay pedidos cargados en el sitema");
  }

  return agruparPedidos(filas);
};

export const getAllPedidosByIdUser = async (id_usuario) => {
  const filas = await pedidosModel.getAllPedidosConDetallesByIdUser(id_usuario);

  if (filas.length === 0) {
    throw new Error("No hay pedidos cargados en el sistema para este usuario");
  }

  return agruparPedidos(filas);
};

export const actualizarPedido = async (id_pedido, datosActualizados) => {
  const { direccion, entregado, metodo_pago, productos, estado } = datosActualizados;

  const pedidoDB = await pedidosModel.getPedidoById(id_pedido);
  if (!pedidoDB) {
    throw new Error(`El pedido con ID ${id_pedido} no existe.`);
  }

  if (pedidoDB.entregado) {
    throw new Error("No se puede modificar un pedido que ya ha sido entregado.");
  }

  if (estado !== undefined && !ESTADOS_PEDIDO.includes(estado)) {
    throw new Error(`Estado inválido. Valores permitidos: ${ESTADOS_PEDIDO.join(", ")}.`);
  }

  const nuevaDireccion = direccion !== undefined ? direccion : pedidoDB.direccion;
  const nuevoEntregado = entregado !== undefined ? entregado : pedidoDB.entregado;
  const nuevoMetodoPago = metodo_pago !== undefined ? metodo_pago : pedidoDB.metodo_pago;

  if (productos !== undefined && Array.isArray(productos)) {
    const detallesActuales = await pedidosModel.getDetallesByPedidoId(id_pedido);

    for (const item of productos) {
      const productoDB = await getProductosId(item.id_producto);
      if (!productoDB) {
        throw new Error(`El producto con ID ${item.id_producto} no existe.`);
      }

      const detalleOriginal = detallesActuales.find(d => d.id_producto === item.id_producto);
      const cantidadOriginal = detalleOriginal ? detalleOriginal.cantidad : 0;
      const stockDisponibleVirtual = productoDB.stock + cantidadOriginal;

      if (stockDisponibleVirtual < item.cantidad) {
        throw new Error(`Stock insuficiente para ${productoDB.nombre}. Disponible real: ${stockDisponibleVirtual}`);
      }

      item.precioReal = productoDB.precio;
    }

    for (const detalle of detallesActuales) {
      await sumarStockProducto(detalle.id_producto, detalle.cantidad);
    }

    await pedidosModel.eliminarDetallesPedido(id_pedido);

    for (const item of productos) {
      const precioTotalItem = Number(item.precioReal) * item.cantidad;

      await insertarDetallePedido(item.cantidad, precioTotalItem, id_pedido, item.id_producto);

      await restarStockProducto(item.id_producto, item.cantidad);
    }
  }

  await pedidosModel.actualizarPedidoBase(id_pedido, nuevaDireccion, nuevoEntregado, nuevoMetodoPago);

  const nuevoEstado = estado !== undefined ? estado : nuevoEntregado ? "Entregado" : pedidoDB.estado;
  await pedidosModel.cambiarEstado(id_pedido, nuevoEstado);

  return {
    success: true,
    id_pedido: Number(id_pedido),
    message: "Pedido actualizado con éxito."
  };
};

export const getPedidoDetallado = async (id_pedido) => {
  const filas = await pedidosModel.getPedidoConDetallesById(id_pedido);
  
  if (filas.length === 0) {
    throw new Error(`El pedido con ID ${id_pedido} no existe.`);
  }

  return normalizarPedido(filas)[0];
};

export const actualizarEstadoPedido = async (id_pedido, estado, usuarioToken) => {
  if (!ESTADOS_PEDIDO.includes(estado)) {
    throw crearError(`Estado inválido. Valores permitidos: ${ESTADOS_PEDIDO.join(", ")}.`, 400);
  }

  const { pedidoDB, rol } = await verificarAccesoPedido(id_pedido, usuarioToken);
  if (rol !== "tienda") {
    throw crearError("Solo la tienda del pedido puede cambiar su estado.", 403);
  }

  if (pedidoDB.entregado && estado !== "Entregado") {
    throw crearError("No se puede revertir el estado de un pedido que ya fue entregado.", 409);
  }

  // "Enviado" solo se asigna creando un envío, y se sale de él entregando o eliminando el envío.
  if (estado === "Enviado" && pedidoDB.estado !== "Enviado") {
    throw crearError("Para pasar un pedido a 'Enviado' creá un envío (POST /envios).", 409);
  }
  if (pedidoDB.estado === "Enviado" && estado !== "Enviado" && estado !== "Entregado") {
    throw crearError("El pedido tiene un envío creado: para volver atrás eliminá el envío (DELETE /envios/:id_envio).", 409);
  }

  await pedidosModel.cambiarEstado(id_pedido, estado);

  return {
    success: true,
    estado,
    entregado: estado === "Entregado",
    message: `Estado del pedido ${id_pedido} actualizado a: ${estado}.`
  };
};

// Verifica que quien consulta sea el comprador del pedido o una tienda con productos en él.
export const verificarAccesoPedido = async (id_pedido, usuarioToken) => {
  const pedidoDB = await pedidosModel.getPedidoById(id_pedido);
  if (!pedidoDB) {
    throw crearError(`El pedido con ID ${id_pedido} no existe.`, 404);
  }

  if (usuarioToken?.tipo === "tienda" && usuarioToken.id_tienda) {
    const esDeLaTienda = await pedidosModel.pedidoTieneProductosDeTienda(id_pedido, usuarioToken.id_tienda);
    if (esDeLaTienda) return { pedidoDB, rol: "tienda" };
  }

  if (usuarioToken?.tipo === "usuario") {
    const usuario = await getUsuarioPorCuenta(usuarioToken.id_cuenta);
    if (usuario && Number(usuario.id_usuario) === Number(pedidoDB.id_usuario)) {
      return { pedidoDB, rol: "usuario" };
    }
  }

  throw crearError("No tenés permiso para ver este pedido.", 403);
};

const ultimoRegistro = (historial, estado) => {
  const filas = historial.filter(h => h.estado === estado);
  return filas.length > 0 ? filas[filas.length - 1] : null;
};

export const getSeguimientoPedido = async (id_pedido, usuarioToken) => {
  const { rol } = await verificarAccesoPedido(id_pedido, usuarioToken);

  const filas = await pedidosModel.getPedidoConDetallesById(id_pedido);
  const historial = await pedidosModel.getHistorialEstados(id_pedido);
  const envio = await getEnvioPorPedido(id_pedido);
  const primerFila = filas[0];
  const estado = primerFila.estado;

  const nombre = primerFila.nombre_usuario || "";
  const apellido = primerFila.apellido_usuario || "";
  const iniciales = `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

  // Una tienda solo ve sus propios productos (y su total) en pedidos con varias tiendas.
  const productos = filas
    .filter(fila => fila.id_detallepedido !== null)
    .filter(fila => rol !== "tienda" || Number(fila.id_tienda_producto) === Number(usuarioToken.id_tienda))
    .map(fila => ({
      id_producto: fila.id_producto,
      nombre: fila.nombre_producto || null,
      imagen: fila.imagen_producto || null,
      cantidad: fila.cantidad,
      precio_unitario: fila.precio_unitario !== null ? Number(fila.precio_unitario) : null,
      subtotal: Number(fila.precio_total),
      id_tienda: fila.id_tienda_producto !== null ? Number(fila.id_tienda_producto) : null,
      nombre_tienda: fila.nombre_tienda || null
    }));

  // Línea de tiempo: Confirmado -> En preparación -> Enviando -> Entregado.
  const enPreparacion = estado !== "Pendiente";
  const enviado = estado === "Enviado" || estado === "Entregado";
  const entregado = estado === "Entregado";
  // El primer registro "Pendiente" es la creación del pedido (con hora); si no, la fecha del pedido (sin hora).
  const creacionConHora = historial[0]?.estado === "Pendiente" && !historial[0].solo_fecha;
  const regPreparacion = enPreparacion ? ultimoRegistro(historial, "En preparación") : null;
  const regEnviado = enviado ? ultimoRegistro(historial, "Enviado") : null;
  const regEntregado = entregado ? ultimoRegistro(historial, "Entregado") : null;
  const pasos = [
    {
      clave: "confirmado",
      titulo: "Confirmado",
      completado: true,
      actual: estado === "Pendiente",
      fecha: creacionConHora ? historial[0].fecha : primerFila.fecha,
      solo_fecha: !creacionConHora
    },
    {
      clave: "en_preparacion",
      titulo: "En preparación",
      completado: enPreparacion,
      actual: estado === "En preparación",
      fecha: regPreparacion?.fecha || null,
      solo_fecha: Boolean(regPreparacion?.solo_fecha)
    },
    {
      clave: "enviando",
      titulo: "Enviando",
      completado: enviado,
      actual: enviado && !entregado,
      fecha: enviado ? regEnviado?.fecha || envio?.fecha_creacion || null : null,
      solo_fecha: Boolean(regEnviado?.solo_fecha)
    },
    {
      clave: "entregado",
      titulo: "Entregado",
      completado: entregado,
      actual: entregado,
      fecha: regEntregado?.fecha || null,
      solo_fecha: Boolean(regEntregado?.solo_fecha)
    }
  ];

  return {
    id_pedido: Number(primerFila.id_pedido),
    estado,
    fecha: primerFila.fecha,
    metodo_pago: primerFila.metodo_pago,
    comprador: {
      nombre: primerFila.nombre_usuario || null,
      apellido: primerFila.apellido_usuario || null,
      iniciales,
      direccion: envio?.direccion || primerFila.direccion
    },
    pasos,
    historial,
    productos,
    total: productos.reduce((suma, p) => suma + p.subtotal, 0),
    envio: envio
      ? {
          id_envio: envio.id_envio,
          codigo_seguimiento: envio.codigo_seguimiento,
          repartidor: envio.repartidor,
          nombre_comprador: envio.nombre_comprador,
          direccion: envio.direccion,
          fecha_creacion: envio.fecha_creacion
        }
      : null
  };
};
