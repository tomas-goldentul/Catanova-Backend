import { crearTienda, buscarTiendaPorNombre, editarTienda, getTiendaById } from "./tiendas.model.js";
import { getProvinciaId } from "../provincias/provincias.controller.js"
async function verificarTiendaPorNombre(nombre) {
    const existe = await buscarTiendaPorNombre(nombre);
    return existe
}

export const insertTienda = async({
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
}) => {

    const existe = await buscarTiendaPorNombre(nombre);
    if (existe) {
        throw new Error("La tienda ya existe");
    }
    const existeProvincia = await getProvinciaId(id_provincia);
    if (!existeProvincia) {
        throw new Error("El id provincia no existe");

    }

    const fechaFinal = fecha_creacion || new Date().toISOString().split('T')[0];
    const tienda = {
        nombre,
        email,
        slogan: slogan,
        telefono: telefono,
        direccion,
        fecha_creacion: fechaFinal,
        id_duenio: Number(id_duenio),
        id_provincia: Number(id_provincia),
        color_primario: color_primario || null,
        color_secundario: color_secundario || null,
        color_terciario: color_terciario || null
    };

    return await crearTienda(tienda);
};


export const updateTienda = async(datosTienda) => {
    const { id_tienda, nombre, email, slogan, telefono, direccion } = datosTienda;

  if (!id_tienda) throw new Error("El ID de la tienda es obligatorio.");
  if (!Number.isFinite(Number(id_tienda))) throw new Error('id_tienda inválido');
  if (!nombre || !email || !slogan || !telefono || !direccion) {
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

    datosTienda.color_primario = datosTienda.color_primario || null;
    datosTienda.color_secundario = datosTienda.color_secundario || null;
    datosTienda.color_terciario = datosTienda.color_terciario || null;

    const tiendaModificada = await editarTienda(datosTienda);
    return tiendaModificada;
}

export const getTiendaId = async(idTienda) => {
    return await getTiendaById(idTienda);
}