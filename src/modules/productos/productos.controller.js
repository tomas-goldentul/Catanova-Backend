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

export const insertProducto = async ({ nombre, precio, stock, imagen, activo, id_tienda }) => {
  
  const existe = await buscarProductoPorNombre(nombre);
  if (existe) {
    throw new Error("El producto ya existe"); 
  }

  const producto = {
    nombre,
    precio: Number(precio),
    stock: Number(stock),
    imagen,
    activo: Boolean(activo), 
    id_tienda: Number(id_tienda),
  };

  return await agregarProducto(producto);
};



