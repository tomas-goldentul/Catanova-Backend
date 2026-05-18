import { crearTienda, buscarTiendaPorNombre } from "./tiendas.model.js";

export const insertTienda = async (req, res) => {
  try {
    const {
      nombre,
      email,
      slogan,
      telefono,
      direccion,
      fecha_creacion,
      id_duenio,
      id_provincia,
      color_primario,
      color_secundario,
      color_terciario
    } = req.query;

    const existe = await buscarTiendaPorNombre(nombre);

    if (existe) {
      return res.status(400).json({ message: "La tienda ya existe" });
    }

    const tienda = {
      nombre,
      email,
      slogan,
      telefono,
      direccion,
      fecha_creacion,
      id_duenio,
      id_provincia,
      color_primario,
      color_secundario,
      color_terciario
    };

    const result = await crearTienda(tienda);
    res.json(result);

  } catch (error) {
    console.error("Error en insertTienda:", error);
    res.status(500).json({
      message: "Error al agregar tienda",
      error: error.message
    });
  }
};