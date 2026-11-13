
import express from 'express';

import {
    obtenerRepartidores,
    crearRepartidor
} from './repartidores.controller.js';

const router = express.Router();

router.get('/', obtenerRepartidores);
router.post('/', crearRepartidor);

export default router;
