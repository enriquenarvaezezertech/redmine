#!/bin/bash
# Script para proteger credenciales SMTP en proyecto Redmine con Docker
# Automatiza buenas prácticas de seguridad usando Bash

set -e

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Verificar que el proyecto es un repositorio Git
info "Verificando que el proyecto es un repositorio Git..."
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    error "Este directorio no es un repositorio Git."
    error "Por favor, inicializa Git primero con: git init"
    exit 1
fi
info "✓ Repositorio Git detectado"

# 2. Eliminar el archivo .env del control de versiones SIN borrarlo del disco
info "Removiendo .env del control de versiones (manteniendo el archivo local)..."
if git ls-files --error-unmatch .env > /dev/null 2>&1; then
    git rm --cached .env 2>/dev/null || true
    info "✓ Archivo .env removido del índice de Git"
else
    warn "El archivo .env no está siendo rastreado por Git (ya está protegido)"
fi

# 3. Asegurar que .env esté listado en .gitignore
info "Verificando que .env esté en .gitignore..."
if [ ! -f .gitignore ]; then
    info "Creando archivo .gitignore..."
    touch .gitignore
fi

if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
    echo ".env" >> .gitignore
    info "✓ .env agregado a .gitignore"
else
    info "✓ .env ya está en .gitignore"
fi

# También asegurar que config/configuration.yml esté en .gitignore
if ! grep -q "^config/configuration\.yml$" .gitignore 2>/dev/null; then
    echo "config/configuration.yml" >> .gitignore
    info "✓ config/configuration.yml agregado a .gitignore"
else
    info "✓ config/configuration.yml ya está en .gitignore"
fi

# 4. Crear un archivo .env.example con las variables (SIN valores reales)
info "Verificando archivo .env.example..."
if [ ! -f .env.example ]; then
    info "Creando archivo .env.example..."
    cat > .env.example << 'EOF'
# Variables de entorno para configuración de Redmine
# Copia este archivo a .env y completa con tus credenciales reales
# 
# IMPORTANTE: El archivo .env contiene credenciales sensibles y NO debe subirse al repositorio

# Configuración SMTP Brevo
SMTP_ADDRESS=
SMTP_PORT=
SMTP_DOMAIN=
SMTP_USER_NAME=
SMTP_PASSWORD=

# Remitente de correo
EMAIL_FROM=
EOF
    info "✓ Archivo .env.example creado"
else
    warn "El archivo .env.example ya existe, no se sobrescribirá"
fi

# Resumen final
echo ""
info "=========================================="
info "Configuración de seguridad completada"
info "=========================================="
info "✓ .env removido del control de versiones"
info "✓ .env agregado a .gitignore"
info "✓ .env.example creado/verificado"
info ""
info "Próximos pasos:"
info "1. Si no tienes un archivo .env, cópialo desde .env.example:"
info "   cp .env.example .env"
info "2. Edita .env y completa con tus credenciales reales"
info "3. El archivo .env NO se subirá al repositorio"
info "4. Puedes hacer commit y push sin problemas"
echo ""
