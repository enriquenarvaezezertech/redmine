# Verificación de Instalación - Personalización de Página de Inicio

## Problema
El contenido personalizado no se está mostrando en la página de inicio.

## Solución Rápida

### Paso 1: Reiniciar el contenedor
```bash
docker-compose down
docker-compose up -d
```

### Paso 2: Verificar que los archivos existen
```bash
# Verificar que el JavaScript existe
docker exec redmine ls -la /usr/src/redmine/public/javascripts/custom_home.js

# Verificar que el CSS existe
docker exec redmine ls -la /usr/src/redmine/public/stylesheets/custom_logo.css
```

### Paso 3: Verificar que el script se inyectó en el layout
```bash
# Verificar si el JavaScript está en el layout
docker exec redmine grep -n "custom_home.js" /usr/src/redmine/app/views/layouts/base.html.erb

# Verificar si el CSS está en el layout
docker exec redmine grep -n "custom_logo.css" /usr/src/redmine/app/views/layouts/base.html.erb
```

### Paso 4: Verificar en el navegador
1. Abre `http://localhost:3000`
2. Abre la consola del navegador (F12)
3. Busca mensajes que empiecen con "Ezertech" o "🚀"
4. Verifica que no haya errores de carga de JavaScript

### Paso 5: Verificar acceso directo al archivo
Abre en el navegador: `http://localhost:3000/javascripts/custom_home.js`
- Si se carga el código JavaScript, el archivo es accesible
- Si da error 404, el volumen no está montado correctamente

## Solución Manual (Si el script de bash no funciona)

Si el script de bash no está inyectando el JavaScript, puedes hacerlo manualmente:

1. Entrar al contenedor:
```bash
docker exec -it redmine bash
```

2. Editar el layout:
```bash
nano /usr/src/redmine/app/views/layouts/base.html.erb
```

3. Buscar la línea `</head>` y agregar ANTES de ella:
```erb
<script src="/javascripts/custom_home.js"></script>
```

4. Guardar y salir (Ctrl+X, Y, Enter)

5. Reiniciar Redmine:
```bash
exit
docker-compose restart redmine
```

## Verificación Final

Después de reiniciar, la página de inicio debería mostrar:
- ✅ Hero section con "Bienvenido a Ezertech"
- ✅ 6 tarjetas con iconos de Font Awesome
- ✅ Sección de características principales
- ✅ Diseño moderno con animaciones

Si aún no funciona, revisa los logs:
```bash
docker-compose logs redmine | tail -50
```
