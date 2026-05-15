const validateProducto = (req, res, next) => {
    const { nombre, precio } = req.body;

    if (!nombre || !precio) {
        return res.status(400).json({
            message: "Faltan datos"
        });
    }

    next();
};

export default validateProducto;