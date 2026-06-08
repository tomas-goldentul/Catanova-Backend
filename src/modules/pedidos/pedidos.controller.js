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