import * as etiquetasModel from "./etiquetas.model.js";
import * as productosModel from "../productos/productos.model.js";

const verificarExistenciaProducto = async (id_producto) => {
  const producto = await productosModel.getProductosId(id_producto);
  if (!producto) throw new Error("El producto no existe");
  return producto;
};

const verificarExistenciaEtiqueta = async (id) => {
  const etiqueta = await etiquetasModel.obtenerEtiquetaId(id);
  if (!etiqueta) throw new Error("La etiqueta no existe");
  return etiqueta;
};

export const crearEtiqueta = async (nombre, id_producto) => {
  if (!nombre || !nombre.trim()) {
    throw new Error("El nombre de la etiqueta es obligatorio");
  }
  if (!id_producto) {
    throw new Error("El id_producto es obligatorio");
  }

  await verificarExistenciaProducto(id_producto);

  const duplicada = await etiquetasModel.verificarEtiquetaDuplicada(nombre.trim(), id_producto);
  if (duplicada) {
    throw new Error("Esta etiqueta ya existe para el producto");
  }

  const etiqueta = await etiquetasModel.agregarEtiqueta(nombre.trim(), Number(id_producto));
  return etiqueta;
};

export const eliminarEtiqueta = async (id) => {
  if (!id) {
    throw new Error("El id de la etiqueta es obligatorio");
  }

  const etiqueta = await verificarExistenciaEtiqueta(id);

  const resultado = await etiquetasModel.borrarEtiqueta(Number(id));
  return resultado;
};

export const obtenerEtiquetasProducto = async (id_producto) => {
  if (!id_producto) {
    throw new Error("El id_producto es obligatorio");
  }

  await verificarExistenciaProducto(id_producto);

  const etiquetas = await etiquetasModel.obtenerEtiquetasPorProducto(Number(id_producto));
  return etiquetas;
};
