#!/bin/bash
set -e

DEPLOY=false

# ── Git pull ───────────────────────────────────────────────────────────────────
echo "→ Pulling latest changes..."
PULL_OUTPUT=$(git pull 2>&1)
PULL_EXIT=$?

echo "$PULL_OUTPUT"

if [ $PULL_EXIT -ne 0 ]; then
  echo ""
  echo "⚠ git pull falló. ¿Qué deseas hacer?"
  echo "  1) Desplegar con el código actual"
  echo "  2) Cancelar"
  read -rp "Opción [1/2]: " choice
  case "$choice" in
    1) DEPLOY=true ;;
    *) echo "Cancelado."; exit 0 ;;
  esac

elif echo "$PULL_OUTPUT" | grep -q "Already up to date"; then
  echo ""
  echo "⚠ No hay cambios nuevos. ¿Qué deseas hacer?"
  echo "  1) Desplegar de todas formas (ya hice pull manual)"
  echo "  2) Cancelar"
  read -rp "Opción [1/2]: " choice
  case "$choice" in
    1) DEPLOY=true ;;
    *) echo "Cancelado."; exit 0 ;;
  esac

else
  DEPLOY=true
fi

# ── Build & Deploy ─────────────────────────────────────────────────────────────
if [ "$DEPLOY" = true ]; then

  # ── Versión ─────────────────────────────────────────────────────────────────
  CURRENT_VERSION=$(grep '"version"' package.json | sed 's/.*"version": "\(.*\)".*/\1/')
  echo ""
  echo "Versión actual: $CURRENT_VERSION"
  read -rp "Nueva versión (Enter para mantener $CURRENT_VERSION): " NEW_VERSION
  NEW_VERSION="${NEW_VERSION:-$CURRENT_VERSION}"

  if [ "$NEW_VERSION" != "$CURRENT_VERSION" ]; then
    sed -i "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json
    sed -i "s/version: '$CURRENT_VERSION'/version: '$NEW_VERSION'/" nuxt.config.ts
    echo "✓ Versión actualizada a $NEW_VERSION"
  fi

  echo ""
  echo "→ Building Docker image..."
  docker build -t teamappspa .

  echo "→ Deploying..."
  docker compose down --remove-orphans 2>/dev/null || true
  docker compose up -d

  source .env 2>/dev/null || true
  echo "✓ Deployed v$NEW_VERSION → ${FRONTEND_URL:-http://localhost:${EXPOSE_PORT:-3000}}"
fi
