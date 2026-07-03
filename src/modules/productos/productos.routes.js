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
      return res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
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

//get productos por categoria
router.get('/get/categoria/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productosController.getProductosPorCategoria(id);
    return res.status(StatusCodes.OK).json(result);
  }
  catch (error) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: error.message })
  }
})

//agregar stock
router.post('/agregar-stock/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    if (!cantidad) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "El campo 'cantidad' es obligatorio" });
    }

    const result = await productosController.agregarStockProducto(id, cantidad);
    res.status(StatusCodes.OK).json({
      message: "Stock agregado exitosamente",
      data: result
    });
  } catch (error) {
    console.error("Error en agregar stock:", error);
    if (error.message.includes("no existe") || error.message.includes("debe ser")) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al agregar stock", error: error.message });
  }
});

//editar stock
router.put('/editar-stock/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    if (cantidad === undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "El campo 'cantidad' es obligatorio" });
    }

    const result = await productosController.editarStockProducto(id, cantidad);
    res.status(StatusCodes.OK).json({
      message: "Stock actualizado exitosamente",
      data: result
    });
  } catch (error) {
    console.error("Error en editar stock:", error);
    if (error.message.includes("no existe") || error.message.includes("negativa")) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al editar stock", error: error.message });
  }
});

//editar nombre
router.put('/editar-nombre/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "El campo 'nombre' es obligatorio" });
    }

    const result = await productosController.editarNombreProducto(id, nombre);
    res.status(StatusCodes.OK).json({
      message: "Nombre actualizado exitosamente",
      data: result
    });
  } catch (error) {
    console.error("Error en editar nombre:", error);
    if (error.message.includes("no existe") || error.message.includes("ya existe")) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al editar nombre", error: error.message });
  }
});

//editar tipo
router.put('/editar-tipo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo } = req.body;

    if (!tipo) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "El campo 'tipo' es obligatorio" });
    }

    const result = await productosController.editarTipoProducto(id, tipo);
    res.status(StatusCodes.OK).json({
      message: "Tipo actualizado exitosamente",
      data: result
    });
  } catch (error) {
    console.error("Error en editar tipo:", error);
    if (error.message.includes("no existe")) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al editar tipo", error: error.message });
  }
});

//cambiar imagen
router.put('/cambiar-imagen/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { imagen } = req.body;

    if (!imagen) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "El campo 'imagen' es obligatorio" });
    }

    const result = await productosController.cambiarImagenProducto(id, imagen);
    res.status(StatusCodes.OK).json({
      message: "Imagen actualizada exitosamente",
      data: result
    });
  } catch (error) {
    console.error("Error en cambiar imagen:", error);
    if (error.message.includes("no existe")) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al cambiar imagen", error: error.message });
  }
});

export default router;