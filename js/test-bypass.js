/* ═══════════════════════════════════════
   🧪 MODO PRUEBAS — SOLO PARA DESARROLLO
   Desbloquea las funciones premium (pedidos,
   sync) SIN usar Firebase. No sube ni baja
   nada de la nube: todo queda en localStorage.
   ═══════════════════════════════════════ */
(function () {
  // 1) Desbloquear funciones premium
  syncHabilitado = true;

  // 2) Nunca escribir en la nube durante las pruebas
  if (typeof guardarEnFirebase === 'function') guardarEnFirebase = function () {};
  if (typeof guardarHistorialEnFirebase === 'function') guardarHistorialEnFirebase = function () {};
  if (typeof guardarPedidosEnFirebase === 'function') guardarPedidosEnFirebase = function () {};

  // 3) No verificar membresía (evita que apague el bypass y evita leer la nube)
  if (typeof verificarYEscucharMembresia === 'function') {
    verificarYEscucharMembresia = function () {};
  }

  // 4) El descuento cruzado de stock de la bodega tampoco debe tocar Firebase
  if (typeof descontarStockBodega === 'function') {
    const originalDescuento = descontarStockBodega;
    descontarStockBodega = function (pedido) {
      const uidPrev = uidActual;
      uidActual = null;
      try { originalDescuento(pedido); } finally { uidActual = uidPrev; }
    };
  }

  // 5) Mantener el bypass activo ante cualquier cambio de sesión
  if (typeof actualizarUIEstadoCuenta === 'function') {
    const originalUI = actualizarUIEstadoCuenta;
    actualizarUIEstadoCuenta = function () {
      syncHabilitado = true;
      originalUI();
      const el = document.getElementById('estadoCuenta');
      if (el) el.textContent = '🧪 Modo pruebas — funciones premium desbloqueadas';
      if (typeof actualizarBadgePedidos === 'function') actualizarBadgePedidos();
    };
  }

  // 6) Indicadores visuales de que estamos en modo pruebas
  if (typeof actualizarBadgePedidos === 'function') actualizarBadgePedidos();
  if (typeof actualizarUIEstadoCuenta === 'function') actualizarUIEstadoCuenta();
  if (typeof toast === 'function') {
    setTimeout(function () {
      toast('🧪 Modo pruebas: funciones premium desbloqueadas (sin Firebase)', 'aviso');
    }, 800);
  }
})();