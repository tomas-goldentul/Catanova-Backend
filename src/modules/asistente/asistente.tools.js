import * as productosModel from "../productos/productos.model.js";
import * as categoriasModel from "../categorias/categorias.model.js";
import * as pedidosModel from "../pedidos/pedidos.model.js";
import { verificarExistenciaTienda } from "../productos/productos.controller.js";

export const HERRAMIENTAS = [
  {
    functionDeclarations: [
      {
        name: "listarProductosTienda",
        description:
          "Lista los productos del catálogo de la tienda del vendedor actual. Devuelve nombre, precio, stock, categoría, tipo y descripción de cada producto.",
        parameters: {
          type: "object",
          properties: {
            incluirInactivos: {
              type: "boolean",
              description:
                "Si es true incluye productos inactivos. Por defecto false (solo activos).",
            },
          },
        },
      },
      {
        name: "crearProducto",
        description:
          "Crea (agrega) un nuevo producto en el catálogo de la tienda del vendedor actual.",
        parameters: {
          type: "object",
          properties: {
            nombre: { type: "string", description: "Nombre del producto (obligatorio)." },
            precio: { type: "number", description: "Precio de venta del producto (obligatorio)." },
            stock: { type: "integer", description: "Cantidad de unidades en stock (obligatorio)." },
            tipo: { type: "string", description: "Tipo/categoría de indumentaria, ej: Remera, Pantalón." },
            descripcion: { type: "string", description: "Descripción / detalle del producto." },
            imagen: {
              type: "string",
              description: "URL de la imagen; puede quedar vacío si no se tiene imagen.",
            },
            id_categoria: {
              type: "integer",
              description: "ID de la categoría de la tienda. Usar listarCategorias para obtener los IDs.",
            },
            activo: {
              type: "boolean",
              description: "Si el producto se publica activo (por defecto true).",
            },
          },
          required: ["nombre", "precio", "stock"],
          
        },
      },
      {
        name: "listarCategorias",
        description: "Lista las categorías disponibles de la tienda del vendedor actual.",
        parameters: { type: "object", properties: {} },
      },
      {
        name: "listarPedidosPendientes",
        description:
          "Lista los pedidos pendientes de entrega de la tienda del vendedor actual. Cada pedido incluye productos, cantidades, cliente y fecha.",
        parameters: { type: "object", properties: {} },
      },
      {
        name: "marcarPedidoEntregado",
        description: "Marca un pedido como entregado (Pendiente -> Entregado).",
        parameters: {
          type: "object",
          properties: {
            id_pedido: { type: "integer", description: "ID del pedido a marcar como entregado." },
          },
          required: ["id_pedido"],
          
        },
      },
      {
        name: "listarMisPedidos",
        description:
          "Lista los pedidos realizados por el comprador actual (usuario logueado). Cada pedido incluye productos, cantidades, estado y fecha.",
        parameters: { type: "object", properties: {} },
      },
      {
        name: "listarProductosActivos",
        description:
          "Lista los productos activos disponibles en toda la plataforma (para compradores pueden buscar y consultar disponibilidad).",
        parameters: {
          type: "object",
          properties: {
            tienda: { type: "integer", description: "ID de tienda opcional para filtrar por tienda." },
          },
        },
      },
    ],
  },
];

const agruparPedidos = (filas) => {
  return filas.reduce((acc, current) => {
    const pedidoExistente = acc.find((p) => p.id_pedido === current.id_pedido);
    const detalle = current.id_detallepedido
      ? {
          id_producto: current.id_producto,
          cantidad: current.cantidad,
          precio_total: Number(current.precio_total),
          nombre_producto: current.nombre_producto || null,
          precio_unitario: current.precio_unitario !== null ? Number(current.precio_unitario) : null,
        }
      : null;

    if (pedidoExistente) {
      if (detalle) pedidoExistente.detalles.push(detalle);
    } else {
      acc.push({
        id_pedido: current.id_pedido,
        fecha: current.fecha,
        direccion: current.direccion,
        entregado: current.entregado,
        metodo_pago: current.metodo_pago,
        nombre_usuario: current.nombre_usuario || null,
        apellido_usuario: current.apellido_usuario || null,
        detalles: detalle ? [detalle] : [],
      });
    }

    return acc;
  }, []);
};

const formatearProductos = (productos) => {
  if (!productos || productos.length === 0) return { total: 0, productos: [] };
  return {
    total: productos.length,
    productos: productos.map((p) => ({
      id_producto: p.id_producto,
      nombre: p.nombre,
      precio: Number(p.precio),
      stock: p.stock,
      activo: p.activo,
      tipo: p.tipo,
      descripcion: p.descripcion,
      id_categoria: p.id_categoria,
      imagen: p.imagen,
    })),
  };
};

const formatearPedidos = (pedidos) => {
  if (!pedidos || pedidos.length === 0) return { total: 0, pedidos: [] };
  return {
    total: pedidos.length,
    pedidos: pedidos.map((p) => ({
      id_pedido: p.id_pedido,
      fecha: p.fecha,
      direccion: p.direccion,
      entregado: p.entregado,
      metodo_pago: p.metodo_pago,
      cliente: p.nombre_usuario
        ? `${p.nombre_usuario}${p.apellido_usuario ? " " + p.apellido_usuario : ""}`.trim()
        : null,
      total_pedido: p.detalles.reduce((sum, d) => sum + Number(d.precio_total || 0), 0),
      productos: p.detalles.map((d) => ({
        nombre: d.nombre_producto,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        subtotal: d.precio_total,
      })),
    })),
  };
};

const infoSinSesionTienda = () => ({
  error: true,
  message:
    "Para operar con la tienda necesitás estar logueado como vendedor/tienda. Indicá al usuario que inicie sesión.",
});

const infoSinSesionComprador = () => ({
  error: true,
  message:
    "Para consultar tus pedidos necesitás estar logueado como usuario. Indicá al usuario que inicie sesión.",
});

const ejecutores = {
  listarProductosTienda: async (args, contexto) => {
    const id_tienda = Number(contexto?.id_tienda);
    if (!id_tienda) return infoSinSesionTienda();

    let productos;
    if (args?.incluirInactivos) {
      productos = await productosModel.getTodosProductosPorTienda(id_tienda);
    } else {
      productos = await productosModel.getProductosPorTienda(id_tienda);
    }
    return formatearProductos(productos);
  },

  crearProducto: async (args, contexto) => {
    const id_tienda = Number(contexto?.id_tienda);
    if (!id_tienda) return infoSinSesionTienda();

    const { nombre, precio, stock, tipo, descripcion, imagen, id_categoria, activo } = args || {};

    if (!nombre || !String(nombre).trim()) {
      return { error: true, message: "El nombre del producto es obligatorio." };
    }
    if (precio === undefined || precio === null || Number(precio) < 0) {
      return { error: true, message: "El precio es obligatorio y debe ser un número mayor o igual a 0." };
    }
    if (stock === undefined || stock === null || Number(stock) < 0) {
      return { error: true, message: "El stock es obligatorio y debe ser un número mayor o igual a 0." };
    }

    const existe = await productosModel.buscarProductoPorNombre(String(nombre).trim());
    if (existe) {
      return { error: true, message: `El producto "${nombre}" ya existe en el sistema.` };
    }

    await verificarExistenciaTienda(id_tienda);

    let categoriaValida = null;
    if (id_categoria) {
      categoriaValida = await categoriasModel.getCategoriasByiD(Number(id_categoria));
      if (categoriaValida && Number(categoriaValida.id_tienda) !== Number(id_tienda)) {
        return {
          error: true,
          message:
            "La categoría seleccionada no pertenece a tu tienda. Usá listarCategorias para elegir una categoría válida.",
        };
      }
    }

    const producto = {
      nombre: String(nombre).trim(),
      precio: Number(precio),
      stock: Number(stock),
      imagen: String(imagen || ""),
      activo: activo === undefined ? true : Boolean(activo),
      id_tienda,
      id_categoria: categoriaValida ? Number(id_categoria) : null,
      tipo: typeof tipo === "string" && tipo.trim() ? tipo.trim() : "General",
      descripcion:
        typeof descripcion === "string" && descripcion.trim() ? descripcion.trim() : "",
    };

    const creado = await productosModel.agregarProducto(producto);
    return {
      ok: true,
      message: `Producto "${creado.nombre}" creado con éxito (id ${creado.id_producto}).`,
      producto: {
        id_producto: creado.id_producto,
        nombre: creado.nombre,
        precio: Number(creado.precio),
        stock: creado.stock,
        tipo: creado.tipo,
        activo: creado.activo,
      },
    };
  },

  listarCategorias: async (_args, contexto) => {
    const id_tienda = Number(contexto?.id_tienda);
    if (!id_tienda) return infoSinSesionTienda();

    const categorias = await categoriasModel.getCategoriasPorTienda(id_tienda);
    if (!categorias || categorias.length === 0) {
      return { total: 0, categorias: [], message: "La tienda no tiene categorías cargadas." };
    }
    return {
      total: categorias.length,
      categorias: categorias.map((c) => ({
        id_categoria: c.id_categoria,
        nombre: c.nombre,
      })),
    };
  },

  listarPedidosPendientes: async (_args, contexto) => {
    const id_tienda = Number(contexto?.id_tienda);
    if (!id_tienda) return infoSinSesionTienda();

    const filas = await pedidosModel.getPedidosPendientesPorTienda(id_tienda);
    return formatearPedidos(agruparPedidos(filas));
  },

  marcarPedidoEntregado: async (args, contexto) => {
    const id_tienda = Number(contexto?.id_tienda);
    if (!id_tienda) return infoSinSesionTienda();

    const id_pedido = Number(args?.id_pedido);
    if (!id_pedido) {
      return { error: true, message: "El id_pedido es obligatorio." };
    }

    const filas = await pedidosModel.getPedidosPorTienda(id_tienda);
    const pedidoDeTienda = filas.some((f) => Number(f.id_pedido) === id_pedido);
    if (!pedidoDeTienda) {
      return { error: true, message: `El pedido con ID ${id_pedido} no pertenece a tu tienda o no existe.` };
    }

    const pedidoDB = await pedidosModel.getPedidoById(id_pedido);
    if (!pedidoDB) {
      return { error: true, message: `El pedido con ID ${id_pedido} no existe.` };
    }
    if (pedidoDB.entregado) {
      return { error: true, message: `El pedido ${id_pedido} ya fue entregado.` };
    }

    await pedidosModel.cambiarEstadoEntregado(id_pedido, true);
    return { ok: true, message: `El pedido ${id_pedido} fue marcado como entregado.` };
  },

  listarMisPedidos: async (_args, contexto) => {
    const id_usuario = Number(contexto?.id_usuario);
    if (!id_usuario) return infoSinSesionComprador();

    const filas = await pedidosModel.getAllPedidosConDetallesByIdUser(id_usuario);
    return formatearPedidos(agruparPedidos(filas));
  },

  listarProductosActivos: async (args) => {
    let productos;
    if (args?.tienda) {
      productos = await productosModel.getProductosPorTienda(Number(args.tienda));
    } else {
      productos = await productosModel.getProductosActivos();
    }
    return formatearProductos(productos);
  },
};

export async function ejecutarHerramienta(nombre, args, contexto) {
  const ejecutor = ejecutores[nombre];
  if (!ejecutor) {
    return { error: true, message: `La herramienta "${nombre}" no existe.` };
  }
  try {
    return await ejecutor(args || {}, contexto || {});
  } catch (error) {
    return { error: true, message: error.message || "Error al ejecutar la herramienta." };
  }
}