import express from "express";
import { insertTienda } from "./tiendas.controller.js";

const router = express.Router();

router.get("/insert", insertTienda);

export default router;