import express from "express";
import { procesarNuevoPedido, getAllPedidos, getAllPedidosByIdUser, getPedidosByTienda, actualizarPedido, getPedidoDetallado, actualizarEstadoPedido, ESTADOS_PEDIDO, getSeguimientoPedido, actualizarFechaEstimada, crearNotaPedido, eliminarNotaPedido } from "./pedidos.controller.js";
import { verificarToken } from "../auth/auth.middleware.js";
import { StatusCodes } from "http-status-codes";
import { Result } from "pg";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const resultado = await procesarNuevoPedido(req.body);
    
    return res.status(StatusCodes.OK).json(resultado);
  } catch (error) {
    console.error("Error en la ruta POST /pedidos:", error.message);
    
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      success: false, 
      message: error.message 
    });
  }
});

router.get("/getAll", async (req, res) =>{
  try{
    const resultados = await getAllPedidos();
 
    return res.status(StatusCodes.OK).json({ success: true, data: resultados });
  }
  catch (error){
      console.error("Error en la ruta get /pedidos:", error.message);
    
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      success: false, 
      message: error.message 
    });
  }
})

router.get("/getAll/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const resultados = await getAllPedidosByIdUser(id_usuario);
    return res.status(StatusCodes.OK).json({ success: true, data: resultados });
  } catch (error) {      
    console.error("Error en la ruta get /pedidos:", error.message);
    
    // Si usas un 404 para cuando no hay datos, queda más semántico que un BAD_REQUEST (400)
    const status = error.message.includes("No hay pedidos") ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST;
    
    return res.status(status).json({
      success: false,
      message: error.message
    });
  }
});

// Pedidos de la tienda logueada (se valida el token contra el id_tienda del parámetro).
router.get("/getAll/tienda/:id_tienda", verificarToken, async (req, res) => {
  const { id_tienda } = req.params;
  try {
    const resultados = await getPedidosByTienda(id_tienda, req.user);
    return res.status(StatusCodes.OK).json({ success: true, data: resultados });
  } catch (error) {
    console.error("Error en la ruta GET /pedidos/getAll/tienda:", error.message);
    const status = error.status || (error.message.includes("No hay pedidos") ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST);
    return res.status(status).json({ success: false, message: error.message });
  }
});

router.put("/:id_pedido", async (req, res) => {
  const { id_pedido } = req.params;

  try {
    const resultado = await actualizarPedido(id_pedido, req.body);
    return res.status(StatusCodes.OK).json(resultado);
  } catch (error) {
    console.error(`[Error PUT /pedidos/${id_pedido}]:`, error.message);

    let statusCode = StatusCodes.BAD_REQUEST;

    if (error.message.includes("no existe")) {
      statusCode = StatusCodes.NOT_FOUND; 
    } else if (error.message.includes("ya ha sido entregado")) {
      statusCode = StatusCodes.CONFLICT; 
    }

    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

// Datos para la pantalla de seguimiento (comprador del pedido o tienda con productos en él).
router.get("/:id_pedido/seguimiento", verificarToken, async (req, res) => {
  const { id_pedido } = req.params;
  try {
    const seguimiento = await getSeguimientoPedido(id_pedido, req.user);
    return res.status(StatusCodes.OK).json({ success: true, data: seguimiento });
  } catch (error) {
    console.error(`[Error GET /pedidos/${id_pedido}/seguimiento]:`, error.message);
    return res.status(error.status || StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/:id_pedido", async (req, res) => {
  const { id_pedido } = req.params;
  try {
    const pedido = await getPedidoDetallado(id_pedido);
    
    return res.status(StatusCodes.OK).json({ 
      success: true, 
      data: pedido 
    });
  } catch (error) {      
    console.error(`[Error GET /pedidos/${id_pedido}]:`, error.message);
    
    const status = error.message.includes("no existe") ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST;
    
    return res.status(status).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Endpoint exclusivo para cambiar el estado de entrega (Repartidores / Admin)
router.patch("/:id_pedido/estado", verificarToken, async (req, res) => {
  const { id_pedido } = req.params;
  const { estado, entregado } = req.body;

  // Se acepta { estado } o, por compatibilidad, { entregado: boolean }.
  const nuevoEstado = typeof estado === "string"
    ? estado.trim()
    : typeof entregado === "boolean"
      ? (entregado ? "Entregado" : "Pendiente")
      : null;

  if (!nuevoEstado || !ESTADOS_PEDIDO.includes(nuevoEstado)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: `El campo 'estado' es obligatorio. Valores permitidos: ${ESTADOS_PEDIDO.join(", ")}.`
    });
  }

  try {
    const resultado = await actualizarEstadoPedido(id_pedido, nuevoEstado, req.user);
    return res.status(StatusCodes.OK).json(resultado);
  } catch (error) {
    console.error(`[Error PATCH /pedidos/${id_pedido}/estado]:`, error.message);
    return res.status(error.status || StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
});

// Fecha estimada de entrega ("YYYY-MM-DD" o null para borrarla). Solo la tienda del pedido.
router.patch("/:id_pedido/fecha-estimada", verificarToken, async (req, res) => {
  const { id_pedido } = req.params;
  try {
    const resultado = await actualizarFechaEstimada(id_pedido, req.body, req.user);
    return res.status(StatusCodes.OK).json({ success: true, data: resultado });
  } catch (error) {
    console.error(`[Error PATCH /pedidos/${id_pedido}/fecha-estimada]:`, error.message);
    return res.status(error.status || StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
});

// Notas e incidencias internas de la tienda sobre el pedido.
router.post("/:id_pedido/notas", verificarToken, async (req, res) => {
  const { id_pedido } = req.params;
  try {
    const nota = await crearNotaPedido(id_pedido, req.body, req.user);
    return res.status(StatusCodes.CREATED).json({ success: true, data: nota });
  } catch (error) {
    console.error(`[Error POST /pedidos/${id_pedido}/notas]:`, error.message);
    return res.status(error.status || StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
});

router.delete("/:id_pedido/notas/:id_nota", verificarToken, async (req, res) => {
  const { id_pedido, id_nota } = req.params;
  try {
    const nota = await eliminarNotaPedido(id_pedido, id_nota, req.user);
    return res.status(StatusCodes.OK).json({ success: true, data: nota });
  } catch (error) {
    console.error(`[Error DELETE /pedidos/${id_pedido}/notas/${id_nota}]:`, error.message);
    return res.status(error.status || StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
});

export default router;