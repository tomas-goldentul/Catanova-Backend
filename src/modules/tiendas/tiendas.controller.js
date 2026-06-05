import { crearTienda, buscarTiendaPorNombre, editarTienda, getTiendaById } from "./tiendas.model.js";

async function verificarTiendaPorNombre(nombre) {
  const existe = await buscarTiendaPorNombre(nombre);
  return existe
}

export const insertTienda = async ({
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
  const fechaFinal = fecha_creacion || new Date().toISOString().split('T')[0];

  // Validaciones numéricas seguras: convertir solo si vienen y son válidos. 
  // Aclaración: Number() convierte la entrada a número. Ésto se usa porque los valores que llegan desde postman suelen ser strings.
  // La función Number.isFinite() verifica si el resultado es un número finito, para evitar errores.
  let duenioId = null;
  if (id_duenio !== undefined && id_duenio !== null && id_duenio !== '') {
    const parsed = Number(id_duenio);
    if (!Number.isFinite(parsed)) throw new Error('id_duenio inválido');
    duenioId = parsed;
  }

  let provinciaId = null;
  if (id_provincia !== undefined && id_provincia !== null && id_provincia !== '') {
    const parsed = Number(id_provincia);
    if (!Number.isFinite(parsed)) throw new Error('id_provincia inválido');
    provinciaId = parsed;
  }

  const tienda = {
    nombre,
    email,
    slogan: slogan,
    telefono: telefono,
    direccion,
    fecha_creacion: fechaFinal,
    id_duenio: duenioId,
    id_provincia: provinciaId,
    color_primario: color_primario || null,
    color_secundario: color_secundario || null,
    color_terciario: color_terciario || null
  };

  return await crearTienda(tienda);
};


export const updateTienda = async (datosTienda) => {
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
  }

  datosTienda.color_primario = datosTienda.color_primario || null;
  datosTienda.color_secundario = datosTienda.color_secundario || null;
  datosTienda.color_terciario = datosTienda.color_terciario || null;

  const tiendaModificada = await editarTienda(datosTienda);
  return tiendaModificada;
}