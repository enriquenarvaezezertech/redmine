#!/bin/bash
# Wrapper script para el entrypoint de Redmine que inyecta el CSS del logo y JavaScript personalizado
# Este script se ejecuta antes del entrypoint original de Redmine

set -e

REDMINE_DIR="/usr/src/redmine"
LAYOUT_FILE="${REDMINE_DIR}/app/views/layouts/base.html.erb"
CSS_PATH="/stylesheets/custom_logo.css"
JS_PATH="/javascripts/custom_home.js"
MAX_RETRIES=5
RETRY_DELAY=3

echo "=========================================="
echo "Redmine Customization Initialization Script"
echo "=========================================="

# FunciÃ³n para inyectar CSS en el layout
inject_logo_css() {
    local retry_count=0
    
    while [ $retry_count -lt $MAX_RETRIES ]; do
        if [ ! -f "$LAYOUT_FILE" ]; then
            echo "Waiting for layout file to be available... (attempt $((retry_count + 1))/$MAX_RETRIES)"
            sleep $RETRY_DELAY
            retry_count=$((retry_count + 1))
            continue
        fi

        # Verificar si el CSS ya estÃ¡ incluido
        if grep -q "custom_logo.css" "$LAYOUT_FILE"; then
            echo "âœ“ Logo CSS already injected in layout"
            return 0
        fi

        # Crear backup
        BACKUP_FILE="${LAYOUT_FILE}.bak.$(date +%s)"
        cp "$LAYOUT_FILE" "$BACKUP_FILE" 2>/dev/null || true
        echo "Created backup: $BACKUP_FILE"

        # MÃ©todo 1: Buscar la lÃ­nea con stylesheet_link_tag para application y agregar despuÃ©s
        if grep -q "stylesheet_link_tag.*application" "$LAYOUT_FILE"; then
            # Insertar despuÃ©s de la lÃ­nea de application stylesheet
            sed -i '/stylesheet_link_tag.*application/a\
    <%= stylesheet_link_tag "'"$CSS_PATH"'", :media => "all" %>
' "$LAYOUT_FILE"
            echo "âœ“ Logo CSS injected successfully after application stylesheet"
            return 0
        fi

        # MÃ©todo 2: Buscar cualquier stylesheet_link_tag
        if grep -q "stylesheet_link_tag" "$LAYOUT_FILE"; then
            # Insertar despuÃ©s de la Ãºltima lÃ­nea de stylesheet_link_tag
            sed -i '/stylesheet_link_tag/{
a\
    <%= stylesheet_link_tag "'"$CSS_PATH"'", :media => "all" %>
}' "$LAYOUT_FILE"
            echo "âœ“ Logo CSS injected after stylesheet tags"
            return 0
        fi

        # MÃ©todo 3: Buscar </head> y agregar antes
        if grep -q "</head>" "$LAYOUT_FILE"; then
            sed -i '/<\/head>/i\
    <%= stylesheet_link_tag "'"$CSS_PATH"'", :media => "all" %>
' "$LAYOUT_FILE"
            echo "âœ“ Logo CSS injected in head section"
            return 0
        fi

        echo "Warning: Could not find suitable location to inject CSS (attempt $((retry_count + 1))/$MAX_RETRIES)"
        retry_count=$((retry_count + 1))
        sleep $RETRY_DELAY
    done

    echo "âœ— Failed to inject CSS after $MAX_RETRIES attempts"
    return 1
}

# FunciÃ³n para inyectar JavaScript en el layout
inject_custom_js() {
    local retry_count=0
    
    while [ $retry_count -lt $MAX_RETRIES ]; do
        if [ ! -f "$LAYOUT_FILE" ]; then
            echo "Waiting for layout file to be available... (attempt $((retry_count + 1))/$MAX_RETRIES)"
            sleep $RETRY_DELAY
            retry_count=$((retry_count + 1))
            continue
        fi

        # Verificar si el JS ya estÃ¡ incluido
        if grep -q "custom_home.js" "$LAYOUT_FILE"; then
            echo "âœ“ Custom JS already injected in layout"
            return 0
        fi

        # MÃ©todo 1: Buscar </head> y agregar antes (mÃ¡s confiable)
        if grep -q "</head>" "$LAYOUT_FILE"; then
            # Inyectar script tag directamente antes de </head>
            sed -i '/<\/head>/i\
    <script src="/javascripts/custom_home.js"></script>
' "$LAYOUT_FILE"
            echo "âœ“ Custom JS injected in head section (inline script tag)"
            return 0
        fi

        # MÃ©todo 2: Buscar javascript_include_tag y agregar despuÃ©s
        if grep -q "javascript_include_tag" "$LAYOUT_FILE"; then
            sed -i '/javascript_include_tag/{
a\
    <%= javascript_include_tag "'"$JS_PATH"'", :defer => false %>
}' "$LAYOUT_FILE"
            echo "âœ“ Custom JS injected after javascript tags"
            return 0
        fi

        # MÃ©todo 3: Buscar </body> y agregar antes
        if grep -q "</body>" "$LAYOUT_FILE"; then
            # Intentar insertar antes de </body>
            sed -i '/<\/body>/i\
    <%= javascript_include_tag "'"$JS_PATH"'", :defer => false %>
' "$LAYOUT_FILE"
            echo "âœ“ Custom JS injected successfully before </body>"
            return 0
        fi

        echo "Warning: Could not find suitable location to inject JS (attempt $((retry_count + 1))/$MAX_RETRIES)"
        retry_count=$((retry_count + 1))
        sleep $RETRY_DELAY
    done

    echo "âœ— Failed to inject JS after $MAX_RETRIES attempts"
    return 1
}

# Verificar que los archivos necesarios existen
echo "Checking required files..."
if [ ! -f "/usr/src/redmine/public/images/logo.png" ]; then
    echo "âš  Warning: Logo file not found at /usr/src/redmine/public/images/logo.png"
fi

if [ ! -f "/usr/src/redmine/public/stylesheets/custom_logo.css" ]; then
    echo "âš  Warning: CSS file not found at /usr/src/redmine/public/stylesheets/custom_logo.css"
fi

if [ ! -f "/usr/src/redmine/public/javascripts/custom_home.js" ]; then
    echo "âš  Warning: JS file not found at /usr/src/redmine/public/javascripts/custom_home.js"
fi

# Intentar inyectar el CSS
echo ""
echo "Injecting logo CSS into Redmine layout..."
inject_logo_css

# Intentar inyectar el JavaScript
echo ""
echo "Injecting custom JavaScript into Redmine layout..."
inject_custom_js

echo ""
echo "=========================================="
echo "Starting Redmine..."
echo "=========================================="

# Ejecutar el entrypoint original de Redmine
exec /docker-entrypoint.sh "$@"
