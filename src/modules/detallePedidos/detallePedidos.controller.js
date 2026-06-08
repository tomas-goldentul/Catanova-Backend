import { getDetallesByPedidoId } from "./detallePedidos.model.js";

export const obtenerDetallesPorPedidoId = async (id_pedido) => {
  if (!id_pedido) {
    throw new Error("El ID del pedido es obligatorio.");
  }

  const detalles = await getDetallesByPedidoId(id_pedido);

  if (!detalles || detalles.length === 0) {
    throw new Error("No se encontraron productos para este pedido.");
  }

  return detalles;
};