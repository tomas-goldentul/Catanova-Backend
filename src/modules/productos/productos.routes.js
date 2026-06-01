import express from "express";
import { GetProductosActivos, insertProducto, getProductos, updateEstadoProducto } from "./productos.controller.js";
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

router.put('/estado/:nombre', async (req, res) => {
  try {
    const { nombre } = req.params;
    const { estado } = req.body;
    const result = await updateEstadoProducto(nombre, estado);
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



export default router;