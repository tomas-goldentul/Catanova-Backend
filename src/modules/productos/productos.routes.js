import express from "express";
import * as productosController from "./productos.controller.js";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

//trae productos activos
router.get("/", productosController.GetProductosActivos);

//agregar producto
router.post('/insert', async (req, res) => {
  try {
    const datosProducto = req.body;

    if (!datosProducto.nombre) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "El campo 'nombre' es obligatorio." });
    }

    const result = await productosController.insertProducto(datosProducto);

    res.status(StatusCodes.CREATED).json({
      message: "Producto creado con éxito ",
      data: result
    });

  } catch (error) {
    console.error("Error en la ruta insertProducto:", error);

    if (error.message === "El producto ya existe") {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al agregar producto", error: error.message });
  }
});

//trae todos los productos (activos e inactivos)
router.get('/get', async (req, res) => {

  try {
    const productos = await productosController.getProductos();
    res.status(StatusCodes.OK).json({
      productos
    });

  }
  catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });

  }
})

//actualizar estado
router.put('/estado/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const result = await productosController.updateEstadoProducto(id, estado);
    const mensajeTexto = estado
      ? "Producto activado con éxito"
      : "Producto inactivado con éxito";

    res.status(StatusCodes.OK).json({
      message: mensajeTexto,
      data: result
    });
  }
  catch (error) {
    console.error("Error en ruta estado:", error.message);

    if (error.message.includes("no existe") || error.message.includes("true o false")) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error interno del servidor", error: error.message });
  }

})

//actualizar producto
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const datosCompletos = {
      id_producto: Number(id),
      ...req.body
    };
    const result = await productosController.actualizarProducto(datosCompletos);

    res.status(StatusCodes.OK).json({
      message: "Producto actualizado con éxito",
      data: result
    });
  }
  catch (error) {
    console.error("Error en la ruta updateProducto:", error.message);
    if (
      error.message.includes("Faltan completar") ||
      error.message.includes("no existe") ||
      error.message.includes("ya está en uso")
    ) {
      return res.status(StatusCodes.NOT_FOUND ).json({ message: error.message });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error interno del servidor", error: error.message });
  }
})

//eliminar producto
router.put('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productosController.eliminarProducto(Number(id));

    res.status(StatusCodes.OK).json({
      message: "Producto eliminado con éxito",
      data: result
    });
  } catch (error) {
    console.error("Error en la ruta eliminarProducto:", error.message);

    if (error.message.includes("no existe")) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error interno del servidor", error: error.message });
  }
});

//ver detalle producto
router.get('/get/detail/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productosController.verDetalleProducto(id);
    return res.status(StatusCodes.OK).json({
      data: result
    });
  }


  catch (error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: error.message
    });
  }
})
export default router;