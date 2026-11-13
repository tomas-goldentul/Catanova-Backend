import { Router } from "express";
import { verificarToken } from "../auth/auth.middleware.js";
import { getEstadisticasTienda, getLecturaEstadisticas } from "./estadisticas.controller.js";

const router = Router();

const responderError = (res, error, ruta) => {
    console.error(`Error en ${ruta}:`, error.message);
    return res.status(error.status || 500).json({ success: false, message: error.message });
};

// Estadísticas de la tienda logueada. ?periodo=hoy|semana|mes (por defecto semana; "dia" = hoy).
// Sin datos devuelve 200 con ceros (nunca 404).
router.get("/tienda/:id_tienda", verificarToken, async (req, res) => {
    try {
        const data = await getEstadisticasTienda(req.params.id_tienda, req.query.periodo, req.user);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return responderError(res, error, "GET /estadisticas/tienda");
    }
});

// Lectura en 2-3 frases generada por IA (Gemini) a partir de las mismas estadísticas.
router.get("/tienda/:id_tienda/lectura", verificarToken, async (req, res) => {
    try {
        const data = await getLecturaEstadisticas(req.params.id_tienda, req.query.periodo, req.user);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return responderError(res, error, "GET /estadisticas/tienda/lectura");
    }
});

export default router;
