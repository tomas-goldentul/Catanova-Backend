import { crearTienda, buscarTiendaPorNombre, editarTienda } from "./tiendas.model.js";

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

  const existe = await verificarTiendaPorNombre(nombre);
  if (existe) {
    throw new Error("La tienda ya existe");
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


export const updateTienda = async (datosTienda) => {
  const { nombre_original, nombre, email, slogan, telefono, direccion } = datosTienda;
  if (!nombre_original) throw new Error("El nombre de la tienda es obligatorio.");
  if (!nombre || !email || !slogan || !telefono || !direccion) {
    throw new Error("Faltan completar campos");
  }

  const existe = await verificarTiendaPorNombre(nombre_original);
  if (!existe) {
    throw new Error("La tienda no existe");
  }

  // Verifica si existe el nuevo nombre que quiere poner
  if (nombre_original !== nombre) {
    const nuevoNombreRepetido = await buscarTiendaPorNombre(nombre);

    if (nuevoNombreRepetido && nuevoNombreRepetido.email !== existe.email) {
      throw new Error("El nuevo nombre ya está en uso");
    }
  }
  datosTienda.color_primario = datosTienda.color_primario || null;
  datosTienda.color_secundario = datosTienda.color_secundario || null;
  datosTienda.color_terciario = datosTienda.color_terciario || null;
  const tiendaModificada = await editarTienda(datosTienda);
  return tiendaModificada;
}