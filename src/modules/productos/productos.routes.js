import express from "express";
import { getProductos, insertProducto } from "./productos.controller.js";

const router = express.Router();

router.get("/", getProductos);
router.get("/insert", insertProducto); //ejemplo de insert http://localhost:3000/productos/insert?nombre=Mouse&precio=100&stock=5&imagen=x.jpg&activo=true&id_tienda=2


export default router;