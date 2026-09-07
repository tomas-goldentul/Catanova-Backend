import { Router } from "express";
import { chat } from "./asistente.controller.js";

const router = Router();

router.post("/chat", chat);

export default router;