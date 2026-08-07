import express from "express"; 
import cors from "cors";
import path from "path"; 
import fs from "fs";
import { fileURLToPath } from "url"; 

import dotenv from "dotenv";
dotenv.config();

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

app.get("/", (req, res) => {
    res.send("¡Servidor de Catanova funcionando!");
});

// Inicio del servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en: http://localhost:${port}`);
});