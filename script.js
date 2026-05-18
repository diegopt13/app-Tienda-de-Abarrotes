/**
 * Sistema de cálculo de pagos con descuentos por volumen
 * Fundamentos de Programación
 * 
 * Lógica de negocio:
 * - >100 unidades → 40% descuento
 * - 25-100 unidades → 20% descuento
 * - 10-24 unidades → 10% descuento
 * - <10 unidades → 0% descuento
 */

// Elementos del DOM
const unidadesInput = document.getElementById('unidades');
const precioInput = document.getElementById('precio');
const calcularBtn = document.getElementById('calcularBtn');
const limpiarBtn = document.getElementById('limpiarBtn');
const resultSection = document.getElementById('resultSection');
const errorSection = document.getElementById('errorSection');
const subtotalValor = document.getElementById('subtotalValor');
const descuentoValor = document.getElementById('descuentoValor');
const totalValor = document.getElementById('totalValor');
const errorMensaje = document.getElementById('errorMensaje');

/**
 * Función para determinar el porcentaje de descuento según las unidades
 * @param {number} unidades - Número de unidades compradas
 * @returns {number} Porcentaje de descuento (0, 10, 20, 40)
 */
function calcularPorcentajeDescuento(unidades) {
    // Validación de rango
    if (unidades <= 0) {
        throw new Error('Las unidades deben ser mayores a 0');
    }
    
    // Función escalonada por intervalos
    if (unidades > 100) {
        return 40;
    } else if (unidades >= 25) {
        return 20;
    } else if (unidades >= 10) {
        return 10;
    } else {
        return 0;
    }
}

/**
 * Función para validar y parsear los inputs del usuario
 * @returns {Object} Objeto con unidades y precio validados
 * @throws {Error} Si algún campo es inválido
 */
function validarEntradas() {
    // Conversión explícita a número (base 10 para evitar interpretación octal)
    const unidadesRaw = unidadesInput.value.trim();
    const precioRaw = precioInput.value.trim();
    
    if (unidadesRaw === '') {
        throw new Error('El campo "Número de unidades" no puede estar vacío');
    }
    
    if (precioRaw === '') {
        throw new Error('El campo "Precio unitario" no puede estar vacío');
    }
    
    // Coerción numérica explícita
    const unidades = Number(unidadesRaw);
    const precioUnitario = Number(precioRaw);
    
    // Validaciones semánticas
    if (isNaN(unidades)) {
        throw new Error('Las unidades deben ser un número válido');
    }
    
    if (isNaN(precioUnitario)) {
        throw new Error('El precio debe ser un número válido');
    }
    
    if (!Number.isInteger(unidades)) {
        throw new Error('Las unidades deben ser un número entero');
    }
    
    if (unidades <= 0) {
        throw new Error('Las unidades deben ser un número positivo mayor a 0');
    }
    
    if (precioUnitario <= 0) {
        throw new Error('El precio unitario debe ser un número positivo');
    }
    
    // Redondeo a 2 decimales para evitar errores de precisión flotante
    const precioRedondeado = Math.round(precioUnitario * 100) / 100;
    
    return {
        unidades: unidades,
        precioUnitario: precioRedondeado
    };
}

/**
 * Función principal de cálculo
 * @param {number} unidades - Unidades compradas
 * @param {number} precioUnitario - Precio por unidad
 * @returns {Object} Objeto con subtotal, porcentajeDescuento, descuento, total
 */
function calcularPago(unidades, precioUnitario) {
    // 1. Cálculo del subtotal
    const subtotal = unidades * precioUnitario;
    
    // 2. Determinación del porcentaje de descuento
    const porcentajeDescuento = calcularPorcentajeDescuento(unidades);
    
    // 3. Cálculo del descuento absoluto
    const descuento = subtotal * (porcentajeDescuento / 100);
    
    // 4. Cálculo del total a pagar
    const totalPagar = subtotal - descuento;
    
    // 5. Redondeo final para representación monetaria
    return {
        subtotal: Math.round(subtotal * 100) / 100,
        porcentajeDescuento: porcentajeDescuento,
        descuento: Math.round(descuento * 100) / 100,
        total: Math.round(totalPagar * 100) / 100
    };
}

/**
 * Función para mostrar los resultados en la interfaz
 * @param {Object} resultados - Objeto con los resultados del cálculo
 */
function mostrarResultados(resultados) {
    // Formateo con 2 decimales y separador de miles colombiano
    const formatearCOP = (valor) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(valor);
    };
    
    subtotalValor.textContent = formatearCOP(resultados.subtotal);
    descuentoValor.textContent = `${resultados.porcentajeDescuento}% → ${formatearCOP(resultados.descuento)}`;
    totalValor.textContent = formatearCOP(resultados.total);
    
    // Animación de aparición
    resultSection.style.display = 'block';
    errorSection.style.display = 'none';
    
    // Scroll suave hasta los resultados
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Función para mostrar errores al usuario
 * @param {string} mensaje - Mensaje de error
 */
function mostrarError(mensaje) {
    errorMensaje.textContent = mensaje;
    errorSection.style.display = 'block';
    resultSection.style.display = 'none';
    
    // Scroll hasta el error
    errorSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Limpiar después de 5 segundos (opcional)
    setTimeout(() => {
        if (errorSection.style.display === 'block') {
            errorSection.style.display = 'none';
        }
    }, 5000);
}

/**
 * Función principal que orquesta el proceso completo
 */
function procesarPago() {
    try {
        // Fase 1: Validación de entradas
        const { unidades, precioUnitario } = validarEntradas();
        
        // Fase 2: Cálculo
        const resultados = calcularPago(unidades, precioUnitario);
        
        // Fase 3: Presentación
        mostrarResultados(resultados);
        
    } catch (error) {
        // Manejo de excepciones
        mostrarError(error.message);
        console.error('[Sistema de Pagos] Error:', error.message);
    }
}

/**
 * Función para limpiar todos los campos y ocultar resultados
 */
function limpiarCampos() {
    unidadesInput.value = '';
    precioInput.value = '';
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
    
    // Enfoque al primer campo
    unidadesInput.focus();
    
    // Opcional: animación de limpieza
    console.log('[Sistema de Pagos] Campos limpiados correctamente');
}

/**
 * Event listeners y configuración inicial
 */
function inicializarAplicacion() {
    // Eventos de botones
    calcularBtn.addEventListener('click', procesarPago);
    limpiarBtn.addEventListener('click', limpiarCampos);
    
    // Evento de tecla Enter en cualquier input
    unidadesInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') procesarPago();
    });
    
    precioInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') procesarPago();
    });
    
    // Validación en tiempo real (opcional, mejora UX)
    unidadesInput.addEventListener('input', () => {
        if (resultSection.style.display === 'block') {
            resultSection.style.display = 'none';
        }
    });
    
    precioInput.addEventListener('input', () => {
        if (resultSection.style.display === 'block') {
            resultSection.style.display = 'none';
        }
    });
    
    console.log('[Sistema de Pagos] Aplicación inicializada correctamente');
}

// Inicialización cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializarAplicacion);