import express from "express";
import { getProductos, insertProducto } from "./productos.controller.js";
import { buscarProductoPorNombre, agregarProducto } from "./productos.model.js";
const router = express.Router();

router.get("/", getProductos);
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


export default router;