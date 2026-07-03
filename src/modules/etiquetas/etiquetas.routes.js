import express from "express";
import * as etiquetasController from "./etiquetas.controller.js";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

// Agregar etiqueta a un producto
router.post("/agregar", async (req, res) => {
  try {
    const { nombre, id_producto } = req.body;

    if (!nombre) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "El campo 'nombre' es obligatorio"
      });
    }

    if (!id_producto) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "El campo 'id_producto' es obligatorio"
      });
    }

    const etiqueta = await etiquetasController.crearEtiqueta(nombre, id_producto);

    res.status(StatusCodes.CREATED).json({
      message: "Etiqueta agregada exitosamente",
      data: etiqueta
    });

  } catch (error) {
    console.error("Error en agregar etiqueta:", error);

    if (error.message.includes("no existe") || error.message.includes("ya existe")) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.message
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error al agregar etiqueta",
      error: error.message
    });
  }
});

// Eliminar etiqueta por ID
router.delete("/:id_etiqueta", async (req, res) => {
  try {
    const { id_etiqueta } = req.params;

    const etiqueta = await etiquetasController.eliminarEtiqueta(id_etiqueta);

    res.status(StatusCodes.OK).json({
      message: "Etiqueta eliminada exitosamente",
      data: etiqueta
    });

  } catch (error) {
    console.error("Error en eliminar etiqueta:", error);

    if (error.message.includes("no existe")) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: error.message
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error al eliminar etiqueta",
      error: error.message
    });
  }
});

// Obtener etiquetas de un producto
router.get("/producto/:id_producto", async (req, res) => {
  try {
    const { id_producto } = req.params;

    const etiquetas = await etiquetasController.obtenerEtiquetasProducto(id_producto);

    res.status(StatusCodes.OK).json({
      message: "Etiquetas obtenidas correctamente",
      data: etiquetas
    });

  } catch (error) {
    console.error("Error en obtener etiquetas:", error);

    if (error.message.includes("no existe")) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: error.message
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error al obtener etiquetas",
      error: error.message
    });
  }
});

export default router;
