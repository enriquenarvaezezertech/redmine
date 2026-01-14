// Script para personalizar la página de inicio de Redmine
// Versión ultra-agresiva que funciona sin depender de clases del body

(function() {
  'use strict';
  
  console.log('🚀 Ezertech Custom Home Script: INICIANDO');
  
  // Función para verificar si estamos en la página de inicio (múltiples métodos)
  function isHomePage() {
    const body = document.body;
    const url = window.location.pathname;
    const content = document.getElementById('content');
    
    if (!content) {
      console.log('Ezertech: No hay #content');
      return false;
    }
    
    // Método 1: Verificar clases del body
    const hasWelcomeClass = body.classList.contains('controller-welcome') && 
                           body.classList.contains('action-index');
    
    // Método 2: Verificar URL
    const isRootUrl = url === '/' || url === '' || url.match(/^\/$/);
    
    // Método 3: Verificar contenido de texto
    const contentText = content.textContent || '';
    const hasInicioContent = contentText.includes('Estamos aquí para ayudarte') ||
                            contentText.includes('Gestiona tus solicitudes');
    
    // Método 4: Verificar títulos
    const title = content.querySelector('h1, h2');
    const hasInicioTitle = title && (title.textContent.includes('Inicio') || title.textContent.includes('Home'));
    
    const result = hasWelcomeClass || isRootUrl || hasInicioContent || hasInicioTitle;
    console.log('Ezertech: isHomePage =', result, {hasWelcomeClass, isRootUrl, hasInicioContent, hasInicioTitle});
    return result;
  }
  
  // Función principal de inicialización
  function init() {
    console.log('Ezertech: init() ejecutado');
    
    // Verificar si estamos en la página de inicio
    if (!isHomePage()) {
      console.log('Ezertech: No es la página de inicio, saliendo');
      return false;
    }
    
    console.log('Ezertech: ✅ Página de inicio confirmada');
    
    // Buscar el contenedor de contenido
    const content = document.getElementById('content');
    if (!content) {
      console.log('Ezertech: ❌ No se encontró #content');
      return false;
    }
    
    // Verificar si ya se inyectó el contenido
    if (content.querySelector('.ezertech-hero')) {
      console.log('Ezertech: ✅ Contenido ya inyectado');
      return true;
    }
    
    console.log('Ezertech: 🎨 Iniciando inyección de contenido...');
    
    // Cargar Font Awesome desde CDN si no está cargado
    if (!document.querySelector('link[href*="font-awesome"]') && 
        !document.querySelector('link[href*="fontawesome"]')) {
      const fontAwesomeLink = document.createElement('link');
      fontAwesomeLink.rel = 'stylesheet';
      fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      fontAwesomeLink.integrity = 'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==';
      fontAwesomeLink.crossOrigin = 'anonymous';
      document.head.appendChild(fontAwesomeLink);
      console.log('Ezertech: ✅ Font Awesome cargado');
    }
    
    // Crear el contenido personalizado
    const customContent = document.createElement('div');
    customContent.className = 'ezertech-custom-content';
    
    // Hero Section
    const hero = document.createElement('div');
    hero.className = 'ezertech-hero';
    hero.innerHTML = `
      <h1>Bienvenido a Ezertech</h1>
      <p>Estamos aquí para ayudarte. Gestiona tus solicitudes, consulta el estado de tus tickets y encuentra respuestas rápidas a todas tus necesidades.</p>
    `;
    
    // Grid de tarjetas principales
    const cardsGrid = document.createElement('div');
    cardsGrid.className = 'ezertech-cards-grid';
    
    const cards = [
      {
        icon: '<i class="fas fa-ticket-alt"></i>',
        title: 'Gestión de Tickets',
        text: 'Crea, gestiona y da seguimiento a todos tus tickets de soporte de manera eficiente y organizada.'
      },
      {
        icon: '<i class="fas fa-project-diagram"></i>',
        title: 'Proyectos',
        text: 'Administra tus proyectos, tareas y recursos en un solo lugar con herramientas potentes de gestión.'
      },
      {
        icon: '<i class="fas fa-chart-line"></i>',
        title: 'Reportes y Análisis',
        text: 'Obtén insights valiosos con reportes detallados y análisis en tiempo real de tus actividades.'
      },
      {
        icon: '<i class="fas fa-users"></i>',
        title: 'Colaboración',
        text: 'Trabaja en equipo de forma eficiente con herramientas de comunicación y colaboración integradas.'
      },
      {
        icon: '<i class="fas fa-shield-alt"></i>',
        title: 'Seguridad',
        text: 'Tus datos están protegidos con los más altos estándares de seguridad y privacidad.'
      },
      {
        icon: '<i class="fas fa-rocket"></i>',
        title: 'Innovación Continua',
        text: 'Sistema en constante evolución con nuevas funcionalidades y mejoras regulares.'
      }
    ];
    
    cards.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.className = 'ezertech-card';
      cardElement.innerHTML = `
        <div class="ezertech-card-icon">${card.icon}</div>
        <h3>${card.title}</h3>
        <p>${card.text}</p>
      `;
      cardsGrid.appendChild(cardElement);
    });
    
    // Sección de características
    const featuresSection = document.createElement('div');
    featuresSection.className = 'ezertech-features';
    featuresSection.innerHTML = `
      <h2>Características Principales</h2>
      <div class="ezertech-features-grid">
        <div class="ezertech-feature-item">
          <div class="ezertech-feature-icon">
            <i class="fas fa-bolt"></i>
          </div>
          <div class="ezertech-feature-content">
            <h4>Rápido y Eficiente</h4>
            <p>Interfaz optimizada para máxima productividad y velocidad de respuesta.</p>
          </div>
        </div>
        <div class="ezertech-feature-item">
          <div class="ezertech-feature-icon">
            <i class="fas fa-mobile-alt"></i>
          </div>
          <div class="ezertech-feature-content">
            <h4>Totalmente Responsive</h4>
            <p>Accede desde cualquier dispositivo, en cualquier momento y lugar.</p>
          </div>
        </div>
        <div class="ezertech-feature-item">
          <div class="ezertech-feature-icon">
            <i class="fas fa-cog"></i>
          </div>
          <div class="ezertech-feature-content">
            <h4>Altamente Configurable</h4>
            <p>Personaliza el sistema según las necesidades específicas de tu organización.</p>
          </div>
        </div>
        <div class="ezertech-feature-item">
          <div class="ezertech-feature-icon">
            <i class="fas fa-headset"></i>
          </div>
          <div class="ezertech-feature-content">
            <h4>Soporte Dedicado</h4>
            <p>Equipo de soporte siempre disponible para ayudarte cuando lo necesites.</p>
          </div>
        </div>
        <div class="ezertech-feature-item">
          <div class="ezertech-feature-icon">
            <i class="fas fa-sync-alt"></i>
          </div>
          <div class="ezertech-feature-content">
            <h4>Sincronización en Tiempo Real</h4>
            <p>Todos los cambios se reflejan instantáneamente para todos los usuarios.</p>
          </div>
        </div>
        <div class="ezertech-feature-item">
          <div class="ezertech-feature-icon">
            <i class="fas fa-database"></i>
          </div>
          <div class="ezertech-feature-content">
            <h4>Almacenamiento Seguro</h4>
            <p>Respaldo automático de todos tus datos con redundancia y seguridad.</p>
          </div>
        </div>
      </div>
    `;
    
    // Agregar todo al contenedor personalizado
    customContent.appendChild(hero);
    customContent.appendChild(cardsGrid);
    customContent.appendChild(featuresSection);
    
    // Buscar el título "Inicio" y el párrafo de descripción para reemplazarlos
    const welcomeTitle = content.querySelector('h1, h2');
    const welcomeText = content.querySelector('p');
    
    // Si encontramos el título y texto de bienvenida, los reemplazamos
    if (welcomeTitle) {
      // Insertar el contenido personalizado antes del contenido existente
      if (welcomeTitle.parentNode === content) {
        content.insertBefore(customContent, welcomeTitle);
      } else {
        // Si el título está dentro de otro contenedor, insertar al inicio del content
        const firstChild = content.firstElementChild || content.firstChild;
        if (firstChild) {
          content.insertBefore(customContent, firstChild);
        } else {
          content.appendChild(customContent);
        }
      }
      
      // Ocultar el título y texto originales de Redmine
      welcomeTitle.style.display = 'none';
      if (welcomeText) {
        welcomeText.style.display = 'none';
      }
    } else {
      // Si no encontramos elementos específicos, simplemente agregar al inicio
      const firstChild = content.firstElementChild || content.firstChild;
      if (firstChild) {
        content.insertBefore(customContent, firstChild);
      } else {
        content.appendChild(customContent);
      }
    }
    
    console.log('Ezertech: ✅✅✅ Contenido personalizado inyectado exitosamente');
    return true;
  }
  
  // Ejecutar inmediatamente si el DOM está listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      console.log('Ezertech: DOMContentLoaded');
      setTimeout(init, 50);
      setTimeout(init, 200);
      setTimeout(init, 500);
      setTimeout(init, 1000);
      setTimeout(init, 2000);
    });
  } else {
    // DOM ya está listo, ejecutar inmediatamente
    console.log('Ezertech: DOM ya listo');
    setTimeout(init, 50);
    setTimeout(init, 200);
    setTimeout(init, 500);
    setTimeout(init, 1000);
    setTimeout(init, 2000);
  }
  
  // También ejecutar cuando la ventana esté completamente cargada
  window.addEventListener('load', function() {
    console.log('Ezertech: window.load');
    setTimeout(init, 100);
    setTimeout(init, 500);
  });
  
  // Ejecutar también cuando el contenido esté visible
  if (document.visibilityState === 'visible') {
    setTimeout(init, 100);
  }
  
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
      setTimeout(init, 100);
    }
  });
  
  // Último recurso: ejecutar después de un delay largo
  setTimeout(function() {
    console.log('Ezertech: Último intento después de 3 segundos');
    init();
  }, 3000);
})();
