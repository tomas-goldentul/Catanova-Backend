import * as pedidosModel from "./pedidos.model.js";
import { getProductosId, restarStockProducto, sumarStockProducto } from "../productos/productos.model.js";
import { insertarDetallePedido } from "../detallepedidos/detallepedidos.model.js";

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
  const pedidos = await pedidosModel.getAllPedidosConDetalles();
  if (pedidos.length === 0) {
    throw new Error("No hay pedidos cargados en el sitema")
  }
  return pedidos;
}

export const getAllPedidosByIdUser = async (id_usuario) => {
  const filas = await pedidosModel.getAllPedidosConDetallesByIdUser(id_usuario);

  if (filas.length === 0) {
    throw new Error("No hay pedidos cargados en el sistema para este usuario");
  }

  // OPCIONAL PERO RECOMENDADO: Agrupar los detalles por pedido
  // Esto transforma las filas repetidas en un objeto limpio con un array de detalles.
  const pedidosAgrupados = filas.reduce((acc, current) => {
    const encontrado = acc.find(p => p.id_Pedido === current.id_Pedido);
    const detalle = {
      id_detalle: current.id_detalle,
      id_producto: current.id_producto,
      cantidad: current.cantidad,
      precio_unitario: current.precio_unitario
    };

    if (encontrado) {
      encontrado.detalles.push(detalle);
    } else {
      acc.push({
        id_Pedido: current.id_Pedido,
        id_usuario: current.id_usuario,
        fecha: current.fecha,
        total: current.total,
        detalles: [detalle]
      });
    }
    return acc;
  }, []);

  return pedidosAgrupados; // Ahora retorna la variable correcta cerrada.
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

  if (productos && Array.isArray(productos)) {
    const detallesActuales = await pedidosModel.getDetallesByPedidoId(id_pedido);

    for (const item of productos) {
      const productoDB = await getProductosId(item.id_producto);
      if (!productoDB) {
        throw new Error(`El producto con ID ${item.id_producto} no existe.`);
      }

      // Encontrar si este producto ya formaba parte del pedido original
      const detalleOriginal = detallesActuales.find(d => d.id_producto === item.id_producto);
      const cantidadOriginal = detalleOriginal ? detalleOriginal.cantidad : 0;

      const stockDisponibleVirtual = productoDB.stock + cantidadOriginal;

      if (stockDisponibleVirtual < item.cantidad) {
        throw new Error(`Stock insuficiente para ${productoDB.nombre}. Disponible real: ${stockDisponibleVirtual}`);
      }

      item.precioReal = productoDB.precio;
    }

    // FASE B: Reversión del stock antiguo
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

  const primerFila = filas[0];
  
  const pedidoEstructurado = {
    id_pedido: primerFila.id_pedido,
    id_usuario: primerFila.id_usuario,
    fecha: primerFila.fecha,
    direccion: primerFila.direccion,
    entregado: primerFila.entregado,
    metodo_pago: primerFila.metodo_pago,
    detalles: filas.map(fila => {
      const precioTotalItem = Number(fila.precio_total);
      return {
        id_detallepedido: fila.id_detallepedido,
        id_producto: fila.id_producto,
        cantidad: fila.cantidad,
        precio_total: precioTotalItem,
        precio_unitario: fila.cantidad > 0 ? (precioTotalItem / fila.cantidad) : 0 // Calcular precio unitario
      };
    })
  };

  return pedidoEstructurado;
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