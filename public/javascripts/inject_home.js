// Script de inyección directa - se ejecuta inmediatamente
// Este script carga custom_home.js de forma forzada

(function() {
  'use strict';
  
  console.log('🔧 Ezertech Inject Script: Cargado');
  
  // Cargar el script principal
  function loadCustomHome() {
    const script = document.createElement('script');
    script.src = '/javascripts/custom_home.js';
    script.async = false;
    script.defer = false;
    script.onload = function() {
      console.log('✅ Ezertech: custom_home.js cargado exitosamente');
    };
    script.onerror = function() {
      console.error('❌ Ezertech: Error al cargar custom_home.js');
      // Reintentar después de 1 segundo
      setTimeout(loadCustomHome, 1000);
    };
    document.head.appendChild(script);
  }
  
  // Ejecutar inmediatamente
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCustomHome);
  } else {
    loadCustomHome();
  }
  
  // También ejecutar después de un delay
  setTimeout(loadCustomHome, 100);
  setTimeout(loadCustomHome, 500);
})();
