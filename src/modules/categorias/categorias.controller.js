import * as categoriasModel from "./categorias.model.js";

export const insertCategoria = async (nombre)=>{
    const existeNombreCategoria = await categoriasModel.getCategoriaPorNombre(nombre);
   
    if (existeNombreCategoria){
        throw new Error (`Ya existe el nombre de categoria: ${nombre}`)
    }

    const categoriaCreada = await categoriasModel.insertCategoria(nombre);
    return categoriaCreada;

}