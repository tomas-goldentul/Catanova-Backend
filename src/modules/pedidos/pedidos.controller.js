import * as pedidosModel from "./pedidos.model.js";
import { getProductosId, restarStockProducto, sumarStockProducto } from "../productos/productos.model.js";
import { insertarDetallePedido } from "../detallepedidos/detallepedidos.model.js";

const normalizarPedido = (filas) => {
  if (!filas || filas.length === 0) return [];

  const primerFila = filas[0];
  const pedido = {
    id_pedido: primerFila.id_pedido,
    id_usuario: primerFila.id_usuario,
    fecha: primerFila.fecha,
    direccion: primerFila.direccion,
    entregado: primerFila.entregado,
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
  const { direccion, entregado, metodo_pago, productos } = datosActualizados;

  const pedidoDB = await pedidosModel.getPedidoById(id_pedido);
  if (!pedidoDB) {
    throw new Error(`El pedido con ID ${id_pedido} no existe.`);
  }

  if (pedidoDB.entregado) {
    throw new Error("No se puede modificar un pedido que ya ha sido entregado.");
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

export const actualizarEstadoPedido = async (id_pedido, entregado) => {
  const pedidoDB = await pedidosModel.getPedidoById(id_pedido);
  if (!pedidoDB) {
    throw new Error(`El pedido con ID ${id_pedido} no existe.`);
  }

  if (pedidoDB.entregado && entregado === false) {
    throw new Error("No se puede revertir el estado de un pedido que ya fue entregado.");
  }

  await pedidosModel.cambiarEstadoEntregado(id_pedido, entregado);

  return {
    success: true,
    message: `Estado del pedido ${id_pedido} actualizado a: ${entregado ? 'Entregado' : 'Pendiente'}.`
  };
};