
import {
    obtenerRepartidores as obtenerRepartidoresModel,
    crearRepartidor as crearRepartidorModel
} from './repartidores.model.js';

export const obtenerRepartidores = async (req, res) => {
    try {
        const { q, id_tienda, limit } = req.query;

        const repartidores = await obtenerRepartidoresModel({
            q,
            id_tienda,
            limit
        });

        return res.status(200).json({
            data: repartidores
        });

    } catch (error) {
        console.error('Error al obtener repartidores:', error);

        return res.status(500).json({
            message: 'No se pudieron obtener los repartidores.'
        });
    }
};

export const crearRepartidor = async (req, res) => {
    try {
        const { nombre, apellido, telefono, id_tienda } = req.body;

        if (!nombre || !String(nombre).trim()) {
            return res.status(400).json({
                message: 'El nombre del repartidor es obligatorio.'
            });
        }

        if (!id_tienda || !Number.isInteger(Number(id_tienda)) || Number(id_tienda) <= 0) {
            return res.status(400).json({
                message: 'La tienda es obligatoria y debe ser válida.'
            });
        }

        const repartidor = await crearRepartidorModel({
            nombre: String(nombre).trim(),
            apellido: apellido ? String(apellido).trim() : null,
            telefono: telefono ? String(telefono).trim() : null,
            id_tienda
        });

        return res.status(201).json({
            message: 'Repartidor creado correctamente.',
            data: repartidor
        });

    } catch (error) {
        console.error('Error al crear repartidor:', error);

        return res.status(500).json({
            message: 'No se pudo crear el repartidor.'
        });
    }
};
