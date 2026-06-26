import express from "express"; 
import cors from "cors";

import dotenv from "dotenv"; //npm i dotnev 
dotenv.config();

import tiendasRoutes from "./modules/tiendas/tiendas.routes.js";
import productoRoutes from "./modules/productos/productos.routes.js";
import pedidosRouter from "./modules/pedidos/pedidos.routes.js";
import categoriasRouter from "./modules/categorias/categorias.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import cuentasRoutes from "./modules/cuentas/cuentas.routes.js";

const app = express();
const port = Number(process.env.PORT) || 3000;          

// Middlewares
app.use(cors());                 
app.use(express.json()); 

// --- RUTAS ---

app.use("/productos", productoRoutes);
app.use("/tiendas", tiendasRoutes);
app.use("/pedidos", pedidosRouter);
app.use("/categorias", categoriasRouter);
app.use("/api/auth", authRoutes);
app.use("/cuentas", cuentasRoutes);

app.get("/", (req, res) => {
    res.send("¡Servidor de Catanova funcionando!");
});

// Inicio del servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en: http://localhost:${port}`);

});