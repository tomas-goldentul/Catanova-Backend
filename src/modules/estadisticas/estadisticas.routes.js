import { Router } from "express";
import { verificarToken } from "../auth/auth.middleware.js";
import { getEstadisticasTienda } from "./estadisticas.controller.js";

const router = Router();

// Estadísticas de la tienda logueada. ?periodo=dia|semana|mes (por defecto semana).
// Sin datos devuelve 200 con ceros (nunca 404).
router.get("/tienda/:id_tienda", verificarToken, async (req, res) => {
    try {
        const periodo = req.query.periodo || "semana";
        const data = await getEstadisticasTienda(req.params.id_tienda, periodo, req.user);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error en GET /estadisticas/tienda:", error.message);
        return res.status(error.status || 500).json({ success: false, message: error.message });
    }
});

export default router;
