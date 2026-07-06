import * as favoritosModel from "./favoritos.model.js";

export const getFavoritos = async () => {
    return await favoritosModel.getAllFavoritos();
};

export const getFavorito = async (id) => {
    const favorito = await favoritosModel.getFavoritoById(id);

    if (!favorito)
        throw new Error("El favorito no existe");

    return favorito;
};

export const insertFavorito = async (favorito) => {

    if (!favorito.id_producto)
        throw new Error("Falta el producto");

    if (!favorito.id_usuario)
        throw new Error("Falta el usuario");

    const existe = await favoritosModel.existeFavorito(favorito.id_producto, favorito.id_usuario);

    if (existe)
        throw new Error("El producto ya está en favoritos");

    return await favoritosModel.agregarFavorito(favorito);
};

export const deleteFavorito = async (id) => {

    const favorito = await favoritosModel.getFavoritoById(id);

    if (!favorito)
        throw new Error("El favorito no existe");

    return await favoritosModel.eliminarFavorito(id);
};

export const getCantidadFavoritosProducto = async (id_producto) => {
    return await favoritosModel.getCantidadFavoritosProducto(id_producto);
};

export const getFavoritosProducto = async (id_producto) => {
    return await favoritosModel.getFavoritosProducto(id_producto);
};

export const getCantidadFavoritosUltimos7Dias = async () => {
    return await favoritosModel.getCantidadFavoritosUltimos7Dias();
};

export const getCantidadFavoritosUltimoMes = async () => {
    return await favoritosModel.getCantidadFavoritosUltimoMes();
};

export const getCantidadFavoritosUltimoAno = async () => {
    return await favoritosModel.getCantidadFavoritosUltimoAno();
};

export const getCantidadFavoritosUltimos2Anios = async () => {
    return await favoritosModel.getCantidadFavoritosUltimos2Anios();
};