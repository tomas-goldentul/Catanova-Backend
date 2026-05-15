import { getAllProductos } from "./productos.model.js";

export const getProductos = async (req, res) => {
  try {
    const rows = await getAllProductos(); 
    if (!rows || rows.length === 0) {
        return res.json([]); 
    }
    
    res.json(rows);
  } catch (error) {
    console.error("Error en getProductos:", error);
    res.status(500).json({ message: "Error al obtener productos", error: error.message });
  }
};

export const createProducto = async (req, res) => {
};