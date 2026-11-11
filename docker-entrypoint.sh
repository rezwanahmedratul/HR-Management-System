#!/bin/sh
set -e

echo "Starting HR Management System..."

# Port configuration
PUBLIC_PORT=${PORT:-10000}
BACKEND_PORT_INT=${BACKEND_INTERNAL_PORT:-4000}

# 1. Start NestJS Backend in background on internal port
cd /app/backend
PORT=$BACKEND_PORT_INT bun dist/main.js &
BACKEND_PID=$!
echo "Backend started with PID $BACKEND_PID on internal port $BACKEND_PORT_INT"

# 2. Start Next.js Frontend on the public PORT
cd /app/frontend
PORT=$PUBLIC_PORT \
HOSTNAME="0.0.0.0" \
API_URL_INTERNAL="http://127.0.0.1:${BACKEND_PORT_INT}/api" \
BACKEND_URL="http://127.0.0.1:${BACKEND_PORT_INT}/api" \
bun server.js &
FRONTEND_PID=$!
echo "Frontend started with PID $FRONTEND_PID on public port $PUBLIC_PORT"

# Graceful shutdown handler
cleanup() {
  echo "Shutting down..."
  kill -TERM "$BACKEND_PID" 2>/dev/null || true
  kill -TERM "$FRONTEND_PID" 2>/dev/null || true
  wait "$BACKEND_PID" 2>/dev/null || true
  wait "$FRONTEND_PID" 2>/dev/null || true
  exit 0
}
trap cleanup INT TERM

# Wait for frontend process
wait "$FRONTEND_PID"
