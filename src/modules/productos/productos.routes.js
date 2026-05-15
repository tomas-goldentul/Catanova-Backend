import express from "express";
import { getProductos, createProducto } from "./productos.controller.js";
import validateProducto from "./productos.middleware.js";

const router = express.Router();

router.get("/", getProductos); 

router.post("/", validateProducto, createProducto);

export default router;