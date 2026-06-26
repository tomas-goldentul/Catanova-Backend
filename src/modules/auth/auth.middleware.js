import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "catanova_secret";

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token requerido" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload; 
        next();
    } catch (err) {       
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expirado" });
        }

        return res.status(401).json({ message: "Token inválido" });
    }
};

export const hashPassword = async (req, res, next) => {
    try {
        if (!req.body.password) {
            return res.status(400).json({ message: "La contraseña es obligatoria" });
        }
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        next();
    } catch (error) {
        return res.status(500).json({ message: "Error al procesar la contraseña" });
    }
};