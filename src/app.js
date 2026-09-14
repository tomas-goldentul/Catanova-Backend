process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import express from "express"; 
import cors from "cors";
import path from "path"; 
import fs from "fs";
import { fileURLToPath } from "url"; 

import dotenv from "dotenv";
dotenv.config();

import db from "./config/db-config.js";

import tiendasRoutes from "./modules/tiendas/tiendas.routes.js";
import productoRoutes from "./modules/productos/productos.routes.js";
import pedidosRouter from "./modules/pedidos/pedidos.routes.js";
import categoriasRouter from "./modules/categorias/categorias.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import cuentasRoutes from "./modules/cuentas/cuentas.routes.js";
import ventasRoutes from "./modules/ventas/ventas.routes.js";
import favoritosRoutes from "./modules/favoritos/favoritos.routes.js";
import vistasRoutes from "./modules/vistas/vistas.routes.js";
import etiquetasRoutes from "./modules/etiquetas/etiquetas.routes.js";
import usuariosRoutes from "./modules/usuarios/usuarios.routes.js";
import asistenteRoutes from "./modules/asistente/asistente.routes.js";

const app = express();
const port = Number(process.env.PORT) || 3000;          

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());                 
app.use(express.json()); 

app.use('/imagenes', express.static(path.join(__dirname, '../public/imagenes')));
// También servir 'public/imagenes' bajo '/uploads' por compatibilidad
app.use('/uploads', express.static(path.join(__dirname, '../public/imagenes')));
// Servir toda la carpeta 'public' en la raíz para rutas como '/imagen.jpg'
app.use(express.static(path.join(__dirname, '../public')));
// --- RUTAS ---

app.use("/productos", productoRoutes);
app.use("/tiendas", tiendasRoutes);
app.use("/pedidos", pedidosRouter);
app.use("/categorias", categoriasRouter);
app.use("/ventas", ventasRoutes);
app.use("/favoritos", favoritosRoutes);
app.use("/vistas", vistasRoutes);
app.use("/api/auth", authRoutes);
app.use("/cuentas", cuentasRoutes);
app.use("/etiquetas", etiquetasRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/asistente", asistenteRoutes);
app.get("/", (req, res) => {
    res.send("¡Servidor de Catanova funcionando!");
});

// Migraciones simples aplicadas al arrancar el servidor
const aplicarMigraciones = async () => {
    try {
        await db.query(`ALTER TABLE IF EXISTS productos ADD COLUMN IF NOT EXISTS descripcion TEXT DEFAULT '';`);
        console.log("Migración aplicada: columna 'descripcion' en productos.");
    } catch (error) {
        console.error("No se pudo aplicar la migración de 'descripcion':", error.message);
    }
};

// Inicio del servidor
aplicarMigraciones()
    .catch(() => {})
    .finally(() => {
        app.listen(port, () => {
            console.log(`Servidor corriendo en: http://localhost:${port}`);
        });
    });