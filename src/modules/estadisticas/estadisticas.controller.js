import * as estadisticasModel from "./estadisticas.model.js";
import { crearError, verificarDuenioTienda } from "../auth/auth.middleware.js";

// diasAtras: días antes de hoy en que arranca el período. duracion: largo en días.
const PERIODOS = {
    dia: { diasAtras: 0, duracion: 1 },
    semana: { diasAtras: 6, duracion: 7 },
    mes: { diasAtras: 29, duracion: 30 },
};

export const ESTADOS_PEDIDO = ["Pendiente", "En preparación", "Enviado", "Entregado", "Cancelado"];

const DIAS_CORTOS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const MESES_CORTOS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const dinero = (valor) => Math.round(Number(valor || 0) * 100) / 100;
const entero = (valor) => Number(valor || 0);
const dosDigitos = (n) => String(n).padStart(2, "0");

// "YYYY-MM-DD" -> Date en UTC, para hacer cuentas de calendario sin que influya la zona horaria del servidor.
const parsearDia = (texto) => {
    const [anio, mes, dia] = texto.split("-").map(Number);
    return new Date(Date.UTC(anio, mes - 1, dia));
};

const claveDia = (fecha) =>
    `${fecha.getUTCFullYear()}-${dosDigitos(fecha.getUTCMonth() + 1)}-${dosDigitos(fecha.getUTCDate())}`;

const indexarPorClave = (filas) => new Map(filas.map((f) => [f.clave, f]));

const valoresDe = (fila) => ({
    facturacion: dinero(fila?.facturacion),
    unidades: entero(fila?.unidades),
    ventas: entero(fila?.ventas),
});

// dia: 24 horas de hoy. semana/mes: un elemento por día, del más viejo al más nuevo.
const armarSerie = (periodo, rangos, filas) => {
    const porClave = indexarPorClave(filas);

    if (periodo === "dia") {
        return Array.from({ length: 24 }, (_, hora) => {
            const clave = `${rangos.hoy}T${dosDigitos(hora)}`;
            return {
                clave,
                etiqueta: `${dosDigitos(hora)}h`,
                detalle: `de ${dosDigitos(hora)}:00 a ${dosDigitos((hora + 1) % 24)}:00`,
                ...valoresDe(porClave.get(clave)),
                futuro: hora > rangos.hora_actual,
            };
        });
    }

    const { duracion } = PERIODOS[periodo];
    const hoy = parsearDia(rangos.hoy);
    return Array.from({ length: duracion }, (_, i) => {
        const fecha = new Date(hoy);
        fecha.setUTCDate(hoy.getUTCDate() - (duracion - 1 - i));
        const clave = claveDia(fecha);
        const diaSemana = fecha.getUTCDay();
        return {
            clave,
            etiqueta: `${DIAS_CORTOS[diaSemana]} ${fecha.getUTCDate()}`,
            detalle: `${DIAS[diaSemana]} ${fecha.getUTCDate()} de ${MESES[fecha.getUTCMonth()]}`,
            ...valoresDe(porClave.get(clave)),
            futuro: false,
        };
    });
};

// Últimos 6 meses calendario; el último es el mes en curso.
const armarVentasPorMes = (rangos, filas) => {
    const porClave = indexarPorClave(filas);
    const hoy = parsearDia(rangos.hoy);
    return Array.from({ length: 6 }, (_, i) => {
        const fecha = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() - (5 - i), 1));
        const mes = fecha.getUTCMonth();
        const clave = `${fecha.getUTCFullYear()}-${dosDigitos(mes + 1)}`;
        return {
            clave,
            etiqueta: MESES_CORTOS[mes],
            detalle: `${MESES[mes]} ${fecha.getUTCFullYear()}`,
            enCurso: i === 5,
            ...valoresDe(porClave.get(clave)),
        };
    });
};

const formatearProducto = (p) => ({
    id_producto: Number(p.id_producto),
    nombre: p.nombre,
    imagen: p.imagen || "",
    unidades: entero(p.unidades),
    facturacion: dinero(p.facturacion),
});

const armarRankings = (filas) => {
    const productos = filas.map((p) => ({ ...formatearProducto(p), activo: p.activo }));

    const masVendidos = productos
        .filter((p) => p.unidades > 0)
        .sort((a, b) => b.unidades - a.unidades || b.facturacion - a.facturacion || a.nombre.localeCompare(b.nombre))
        .slice(0, 5);

    const idsMasVendidos = new Set(masVendidos.map((p) => p.id_producto));
    const activos = productos.filter((p) => p.activo);

    const menosVendidos = activos
        .filter((p) => !idsMasVendidos.has(p.id_producto))
        .sort((a, b) => a.unidades - b.unidades || a.facturacion - b.facturacion || a.nombre.localeCompare(b.nombre))
        .slice(0, 5);

    const sinActivo = ({ activo, ...resto }) => resto;
    return {
        masVendidos: masVendidos.map(sinActivo),
        menosVendidos: menosVendidos.map(sinActivo),
        productosSinVentas: activos.filter((p) => p.unidades === 0).length,
    };
};

const armarPedidos = (filas) => {
    const porEstado = Object.fromEntries(ESTADOS_PEDIDO.map((estado) => [estado, 0]));
    let actual = 0;
    let anterior = 0;
    let facturacion = 0;
    let pendientesTotales = 0;

    for (const fila of filas) {
        const estado = fila.estado || "Pendiente";
        porEstado[estado] = (porEstado[estado] || 0) + entero(fila.actual);
        actual += entero(fila.actual);
        anterior += entero(fila.anterior);
        if (estado !== "Cancelado") facturacion += Number(fila.facturacion || 0);
        if (estado === "Pendiente") pendientesTotales += entero(fila.historico);
    }

    return {
        total: { actual, anterior },
        facturacion: dinero(facturacion),
        porEstado,
        pendientesTotales,
    };
};

// Las vistas no deberían romper toda la respuesta: si fallan se devuelve null.
const obtenerVistas = async (id_tienda, rangos) => {
    try {
        const fila = await estadisticasModel.getResumenVistas(id_tienda, rangos);
        return { actual: entero(fila.actual), anterior: entero(fila.anterior) };
    } catch (error) {
        console.error("No se pudieron calcular las vistas de la tienda:", error.message);
        return null;
    }
};

export const getEstadisticasTienda = async (id_tienda, periodo, usuarioToken) => {
    verificarDuenioTienda(usuarioToken, id_tienda);

    if (!PERIODOS[periodo]) {
        throw crearError("Período inválido. Valores permitidos: dia, semana, mes.", 400);
    }

    const idTienda = Number(id_tienda);
    const { diasAtras, duracion } = PERIODOS[periodo];
    const rangos = await estadisticasModel.getRangos(diasAtras, duracion);

    const [resumenVentas, filasSerie, filasMeses, filasProductos, vistas, filasPedidos] = await Promise.all([
        estadisticasModel.getResumenVentas(idTienda, rangos),
        estadisticasModel.getVentasAgrupadas(
            idTienda,
            rangos.desde,
            rangos.hasta,
            periodo === "dia" ? 'YYYY-MM-DD"T"HH24' : "YYYY-MM-DD"
        ),
        estadisticasModel.getVentasAgrupadas(idTienda, rangos.desde_meses, rangos.hasta, "YYYY-MM"),
        estadisticasModel.getProductosDelPeriodo(idTienda, rangos.desde, rangos.hasta),
        obtenerVistas(idTienda, rangos),
        estadisticasModel.getPedidosPorEstado(idTienda, rangos),
    ]);

    const facturacionActual = dinero(resumenVentas.facturacion_actual);
    const facturacionAnterior = dinero(resumenVentas.facturacion_anterior);
    const ventasActual = entero(resumenVentas.ventas_actual);
    const ventasAnterior = entero(resumenVentas.ventas_anterior);

    return {
        periodo,
        desde: new Date(rangos.desde).toISOString(),
        hasta: new Date(rangos.hasta).toISOString(),
        comparacion: {
            desde: new Date(rangos.desde_anterior).toISOString(),
            hasta: new Date(rangos.hasta_anterior).toISOString(),
        },
        resumen: {
            facturacion: { actual: facturacionActual, anterior: facturacionAnterior },
            unidades: { actual: entero(resumenVentas.unidades_actual), anterior: entero(resumenVentas.unidades_anterior) },
            ventas: { actual: ventasActual, anterior: ventasAnterior },
            ticketPromedio: {
                actual: ventasActual ? Math.round(facturacionActual / ventasActual) : 0,
                anterior: ventasAnterior ? Math.round(facturacionAnterior / ventasAnterior) : 0,
            },
            vistas,
        },
        serie: armarSerie(periodo, rangos, filasSerie),
        ventasPorMes: armarVentasPorMes(rangos, filasMeses),
        ...armarRankings(filasProductos),
        pedidos: armarPedidos(filasPedidos),
    };
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
