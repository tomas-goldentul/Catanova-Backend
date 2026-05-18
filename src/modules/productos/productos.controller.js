import { getAllProductos, agregarProducto, buscarProductoPorNombre} from "./productos.model.js";

export const getProductos = async (req, res) => {
  try {
    const filasModificadas = await getAllProductos();
    if (!filasModificadas || filasModificadas.length === 0) {
      return res.json([]);
    }

    res.json(filasModificadas);
  } catch (error) {
    console.error("Error en getProductos:", error);
    res.status(500).json({ message: "Error al obtener productos", error: error.message });
  }
};

export const insertProducto = async (req, res) => {

  try {
    const { nombre, precio, stock, imagen, activo, id_tienda } = req.query;

    //verificar si el nombre esta repetido
    const existe = await buscarProductoPorNombre(nombre);
    if (existe) {
      return res.status(400).json({ message: "El producto ya existe" });
    }

    const producto = {
      nombre,
      precio: Number(precio),
      stock: Number(stock),
      imagen,
      activo: activo === "true",
      id_tienda: Number(id_tienda),
    };
    const result = await agregarProducto(producto);
    res.json(result);
  }
  catch (error) {
    console.error("Error en insertProducto:", error);
    res.status(500).json({ message: "Error al agregar productos", error: error.message });
  }
}



