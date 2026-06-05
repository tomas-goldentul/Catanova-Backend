import express from "express";
import { GetProductosActivos, insertProducto, getProductos, updateEstadoProducto, actualizarProducto } from "./productos.controller.js";
const router = express.Router();

//trae productos activos
router.get("/", GetProductosActivos);

//agregar producto
router.post('/insert', async (req, res) => {
  try {
    const datosProducto = req.body;

    if (!datosProducto.nombre) {
      return res.status(400).json({ message: "El campo 'nombre' es obligatorio." });
    }

    const result = await insertProducto(datosProducto);

    res.status(201).json({
      message: "Producto creado con éxito ",
      data: result
    });

  } catch (error) {
    console.error("Error en la ruta insertProducto:", error);

    if (error.message === "El producto ya existe") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Error al agregar producto", error: error.message });
  }
});

//trae todos los productos (activos e inactivos)
router.get('/all', async (req, res) => {

  try {
    const productos = await getProductos();
    res.status(200).json({
      productos
    });

  }
  catch (error) {
    return res.status(400).json({ message: error.message });

  }
})

//actualizar estado
router.put('/estado/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const result = await updateEstadoProducto(id, estado);
    const mensajeTexto = estado
      ? "Producto activado con éxito"
      : "Producto inactivado con éxito";

    res.status(200).json({
      message: mensajeTexto,
      data: result
    });
  }
  catch (error) {
    console.error("Error en ruta estado:", error.message);

    if (error.message.includes("no existe") || error.message.includes("true o false")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
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
    const result = await actualizarProducto(datosCompletos);

    res.status(200).json({
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
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
})



export default router;