import * as pedidosModel from "./pedidos.model.js";
import { getProductosId, restarStockProducto } from "../productos/productos.model.js";
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