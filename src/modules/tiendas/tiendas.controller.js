import { crearTienda, buscarTiendaPorNombre, editarTienda, getTiendaById, getNombreTiendaById, getSloganTiendaById } from "./tiendas.model.js";
import { getProvinciaId } from "../provincias/provincias.controller.js"
async function verificarTiendaPorNombre(nombre) {
    const existe = await buscarTiendaPorNombre(nombre);
    return existe
}

export const insertTienda = async({
    nombre,
    slogan,
    telefono,
    direccion,
    id_duenio,
    id_provincia,
    color_primario,
    color_secundario,
    color_terciario,
    id_cuenta
}) => {

    const existe = await buscarTiendaPorNombre(nombre);
    if (existe) {
        throw new Error("La tienda ya existe");
    }
    const existeProvincia = await getProvinciaId(id_provincia);
    if (!existeProvincia) {
        throw new Error("El id provincia no existe");

    }

    const tienda = {
        nombre,
        slogan: slogan,
        telefono: telefono,
        direccion,
        id_duenio: Number(id_duenio),
        id_provincia: Number(id_provincia),
        color_primario: color_primario || null,
        color_secundario: color_secundario || null,
        color_terciario: color_terciario || null,
        id_cuenta: Number(id_cuenta)
    };

    return await crearTienda(tienda);
};


export const updateTienda = async (datosTienda) => {
  const { id_tienda, nombre, slogan, telefono, direccion } = datosTienda;

  if (!id_tienda) throw new Error("El ID de la tienda es obligatorio.");
  if (!Number.isFinite(Number(id_tienda))) throw new Error("id_tienda inválido");

  if (!nombre || !slogan || !telefono || !direccion) {
    throw new Error("Faltan completar campos");
  }

  const tiendaActual = await getTiendaById(id_tienda);
  if (!tiendaActual) {
    throw new Error("La tienda no existe");
  }

  if (tiendaActual.nombre !== nombre) {
    const nombreDuplicado = await buscarTiendaPorNombre(nombre);
    if (nombreDuplicado) {
      throw new Error("El nuevo nombre ya está en uso");
    }
  }

  const datosLimpios = {
    ...datosTienda,
    color_primario: datosTienda.color_primario || null,
    color_secundario: datosTienda.color_secundario || null,
    color_terciario: datosTienda.color_terciario || null,
  };

  return await editarTienda(datosLimpios);
};

export const getTiendaId = async(idTienda) => {
    return await getTiendaById(idTienda);
}

export const getNombreTienda = async(idTienda) => {
    return await getNombreTiendaById(idTienda);
}
export const getSloganTienda = async(idTienda) => {
    return await getSloganTiendaById(idTienda);
}