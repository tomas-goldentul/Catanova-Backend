import express from "express";
import { GetProductosActivos, insertProducto, getProductos } from "./productos.controller.js";
const router = express.Router();

router.get("/", GetProductosActivos);
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



export default router;