import * as estadisticasModel from "./estadisticas.model.js";
import { crearError, verificarDuenioTienda } from "../auth/auth.middleware.js";
import { generarTexto } from "../asistente/asistente.service.js";

export const PERIODOS = ["hoy", "semana", "mes"];
const ALIAS_PERIODO = { dia: "hoy" };

// En la base solo existen estos 4 estados (CHECK pedidos_estado_check). "Cancelado" no existe:
// se devuelve siempre en 0 para que el front tenga la clave (ver documentación del endpoint).
export const ESTADOS_PEDIDO = ["Pendiente", "En preparación", "Enviado", "Entregado", "Cancelado"];

const dinero = (valor) => Math.round(Number(valor || 0) * 100) / 100;
const entero = (valor) => Number(valor || 0);
const dosDigitos = (n) => String(n).padStart(2, "0");
const porcentaje = (parte, total) => (total > 0 ? Math.round((parte / total) * 1000) / 10 : 0);

// Variación % contra el período anterior (1 decimal). null si el anterior es 0 (no hay base de comparación).
const variacion = (actual, anterior) =>
    anterior > 0 ? Math.round(((actual - anterior) / anterior) * 1000) / 10 : null;

export const normalizarPeriodo = (valor) => {
    const periodo = ALIAS_PERIODO[valor] || valor || "semana";
    if (!PERIODOS.includes(periodo)) {
        throw crearError(`Período inválido. Valores permitidos: ${PERIODOS.join(", ")}.`, 400);
    }
    return periodo;
};

// "YYYY-MM-DD" + n días, sin depender de la zona horaria del servidor.
const sumarDias = (texto, n) => {
    const [anio, mes, dia] = texto.split("-").map(Number);
    const fecha = new Date(Date.UTC(anio, mes - 1, dia + n));
    return `${fecha.getUTCFullYear()}-${dosDigitos(fecha.getUTCMonth() + 1)}-${dosDigitos(fecha.getUTCDate())}`;
};

// Claves de los baldes de la serie, completas y en orden.
const clavesSerie = (periodo, rangos) => {
    if (periodo === "hoy") return Array.from({ length: 24 }, (_, h) => dosDigitos(h));
    const cantidad = periodo === "semana" ? 7 : rangos.dias_mes;
    return Array.from({ length: cantidad }, (_, i) => sumarDias(rangos.dia_inicio, i));
};

const acumuladorVacio = () => ({ facturado: 0, unidades: 0, operaciones: new Set(), pedidos: new Set() });

const acumular = (acc, op) => {
    acc.facturado += Number(op.monto || 0);
    acc.unidades += entero(op.cantidad);
    acc.operaciones.add(op.id_operacion);
    if (op.origen === "pedido") acc.pedidos.add(op.id_pedido);
};

const cerrarAcumulador = (acc) => ({
    facturado: dinero(acc.facturado),
    ventas: acc.operaciones.size,
    unidades: acc.unidades,
});

const armarRankings = (productosTienda, operacionesActuales) => {
    const porProducto = new Map();
    for (const op of operacionesActuales) {
        const id = Number(op.id_producto);
        const acc = porProducto.get(id) || { unidades: 0, facturado: 0 };
        acc.unidades += entero(op.cantidad);
        acc.facturado += Number(op.monto || 0);
        porProducto.set(id, acc);
    }

    const productos = productosTienda.map((p) => {
        const vendido = porProducto.get(Number(p.id_producto)) || { unidades: 0, facturado: 0 };
        return {
            id_producto: Number(p.id_producto),
            nombre: p.nombre,
            imagen: p.imagen || "",
            unidades: vendido.unidades,
            facturado: dinero(vendido.facturado),
            activo: Boolean(p.activo),
        };
    });

    const top = productos
        .filter((p) => p.unidades > 0)
        .sort((a, b) => b.unidades - a.unidades || b.facturado - a.facturado || a.nombre.localeCompare(b.nombre))
        .slice(0, 5);

    // Solo activos, sin repetir los que ya están en el top (si la tienda tiene pocos productos).
    const idsTop = new Set(top.map((p) => p.id_producto));
    const menos = productos
        .filter((p) => p.activo && !idsTop.has(p.id_producto))
        .sort((a, b) => a.unidades - b.unidades || a.facturado - b.facturado || a.nombre.localeCompare(b.nombre))
        .slice(0, 5);

    const sinActivo = ({ activo, ...resto }) => resto;
    return { top_productos: top.map(sinActivo), menos_vendidos: menos.map(sinActivo) };
};

// Si las vistas fallan no se rompe toda la respuesta: se devuelven en null.
const obtenerVistas = async (id_tienda, rangos) => {
    try {
        const fila = await estadisticasModel.getResumenVistas(id_tienda, rangos);
        return { actual: entero(fila.actual), anterior: entero(fila.anterior) };
    } catch (error) {
        console.error("No se pudieron calcular las vistas de la tienda:", error.message);
        return { actual: null, anterior: null };
    }
};

export const getEstadisticasTienda = async (id_tienda, periodoQuery, usuarioToken) => {
    verificarDuenioTienda(usuarioToken, id_tienda);
    const periodo = normalizarPeriodo(periodoQuery);
    const idTienda = Number(id_tienda);

    const rangos = await estadisticasModel.getRangos(periodo);
    const desde = new Date(rangos.desde);
    const hasta = new Date(rangos.hasta);
    const desdeAnterior = new Date(rangos.desde_anterior);
    const hastaAnterior = new Date(rangos.hasta_anterior);

    const [operaciones, productosTienda, vistas] = await Promise.all([
        estadisticasModel.getOperaciones(idTienda, desdeAnterior, hasta),
        estadisticasModel.getProductosTienda(idTienda),
        obtenerVistas(idTienda, rangos),
    ]);

    const actual = acumuladorVacio();
    const anterior = acumuladorVacio();
    const operacionesActuales = [];
    const claves = clavesSerie(periodo, rangos);
    const baldes = new Map(claves.map((clave) => [clave, acumuladorVacio()]));
    const estadoPedido = new Map(); // id_pedido -> estado (período actual)
    let facturadoPedidos = 0;
    let facturadoManual = 0;

    for (const op of operaciones) {
        const instante = new Date(op.instante);
        if (instante >= desde && instante <= hasta) {
            acumular(actual, op);
            operacionesActuales.push(op);
            const balde = baldes.get(periodo === "hoy" ? op.hora_local : op.dia_local);
            if (balde) acumular(balde, op);
            if (op.origen === "pedido") {
                facturadoPedidos += Number(op.monto || 0);
                estadoPedido.set(op.id_pedido, op.estado_pedido || "Pendiente");
            } else {
                facturadoManual += Number(op.monto || 0);
            }
        } else if (instante >= desdeAnterior && instante < hastaAnterior) {
            acumular(anterior, op);
        }
    }

    const resumenActual = { ...cerrarAcumulador(actual), vistas: vistas.actual, pedidos: actual.pedidos.size };
    const resumenAnterior = { ...cerrarAcumulador(anterior), vistas: vistas.anterior, pedidos: anterior.pedidos.size };
    const resumenVariacion = Object.fromEntries(
        Object.keys(resumenActual).map((k) => [
            k,
            resumenActual[k] === null || resumenAnterior[k] === null ? null : variacion(resumenActual[k], resumenAnterior[k]),
        ])
    );

    const serie = claves.map((clave) => ({
        clave,
        ...cerrarAcumulador(baldes.get(clave)),
        futuro: periodo === "hoy" ? Number(clave) > rangos.hora_actual : clave > rangos.hoy,
    }));

    const porEstado = Object.fromEntries(ESTADOS_PEDIDO.map((estado) => [estado, 0]));
    for (const estado of estadoPedido.values()) porEstado[estado] = (porEstado[estado] || 0) + 1;

    const totalFacturado = facturadoPedidos + facturadoManual;

    return {
        periodo,
        zona_horaria: estadisticasModel.TZ,
        rango: { desde: desde.toISOString(), hasta: hasta.toISOString() },
        rango_anterior: { desde: desdeAnterior.toISOString(), hasta: hastaAnterior.toISOString() },
        resumen: { actual: resumenActual, anterior: resumenAnterior, variacion: resumenVariacion },
        serie,
        ...armarRankings(productosTienda, operacionesActuales),
        pedidos: {
            total: estadoPedido.size,
            por_estado: porEstado,
            facturado_pedidos: dinero(facturadoPedidos),
            facturado_manual: dinero(facturadoManual),
            porcentaje_pedidos: porcentaje(facturadoPedidos, totalFacturado),
            porcentaje_manual: porcentaje(facturadoManual, totalFacturado),
        },
    };
};

const NOMBRE_PERIODO = { hoy: "hoy (comparado con ayer a la misma hora)", semana: "esta semana (comparada con el mismo tramo de la semana pasada)", mes: "este mes (comparado con el mismo tramo del mes pasado)" };

const PROMPT_LECTURA = `Sos un analista de ventas de Catanova. Te paso en JSON las estadísticas reales de una tienda.
Escribí entre 2 y 3 frases en español rioplatense, en texto plano (sin markdown, sin listas, sin emojis), dirigidas al vendedor.
Usá SOLO los números del JSON, no inventes datos ni causas. Los montos están en pesos argentinos.
"variacion" es el % contra el período anterior; si es null, no había datos para comparar (no digas que subió ni bajó).
Mencioná cómo viene la facturación, el producto que más se vendió si hay, y cerrá con una sugerencia concreta.
Si no hubo ventas en el período, decilo de forma simple y sugerí una acción.`;

// 2-3 frases de lectura de los números, generadas por IA con las estadísticas calculadas en el back.
export const getLecturaEstadisticas = async (id_tienda, periodoQuery, usuarioToken) => {
    const datos = await getEstadisticasTienda(id_tienda, periodoQuery, usuarioToken);

    const entrada = {
        periodo: NOMBRE_PERIODO[datos.periodo],
        actual: datos.resumen.actual,
        anterior: datos.resumen.anterior,
        variacion: datos.resumen.variacion,
        mas_vendidos: datos.top_productos.slice(0, 3).map(({ nombre, unidades, facturado }) => ({ nombre, unidades, facturado })),
        menos_vendidos: datos.menos_vendidos.slice(0, 3).map(({ nombre, unidades }) => ({ nombre, unidades })),
        pedidos: datos.pedidos,
    };

    const { texto, modelo } = await generarTexto({
        system: PROMPT_LECTURA,
        prompt: JSON.stringify(entrada),
    });

    return { periodo: datos.periodo, texto, modelo, generado_en: new Date().toISOString() };
};

// Vistas de la tienda entre dos fechas (ISO). Por defecto, los últimos 30 días.
export const getVistasTienda = async (id_tienda, { desde, hasta }, usuarioToken) => {
    verificarDuenioTienda(usuarioToken, id_tienda);

    const hastaFecha = hasta ? new Date(hasta) : new Date();
    const desdeFecha = desde ? new Date(desde) : new Date(hastaFecha.getTime() - 30 * 24 * 60 * 60 * 1000);
    if (Number.isNaN(desdeFecha.getTime()) || Number.isNaN(hastaFecha.getTime())) {
        throw crearError("Fechas inválidas. Usá formato ISO, por ejemplo 2026-11-01T03:00:00.000Z.", 400);
    }
    if (desdeFecha > hastaFecha) {
        throw crearError("'desde' no puede ser posterior a 'hasta'.", 400);
    }

    const filas = await estadisticasModel.getVistasPorProducto(Number(id_tienda), desdeFecha, hastaFecha);
    const porProducto = filas.map((f) => ({
        id_producto: Number(f.id_producto),
        nombre: f.nombre,
        cantidad: entero(f.cantidad),
    }));

    return {
        id_tienda: Number(id_tienda),
        desde: desdeFecha.toISOString(),
        hasta: hastaFecha.toISOString(),
        cantidad: porProducto.reduce((total, p) => total + p.cantidad, 0),
        porProducto,
    };
};
