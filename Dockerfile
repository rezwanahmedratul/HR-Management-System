# ==============================================================================
# HR Management System - Production Unified Container
# Designed for 1-Click Cloud Deployments (Render, Railway, Fly.io, etc.)
# Runs both NestJS Backend & Next.js Frontend with internal proxy routing.
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Backend (NestJS + Bun)
# ------------------------------------------------------------------------------
FROM oven/bun:1 AS backend-builder
WORKDIR /app/backend

COPY backend/package.json ./
RUN bun install

COPY backend/ ./
RUN bun run build
RUN rm -rf node_modules && bun install --production

# ------------------------------------------------------------------------------
# Stage 2: Build Frontend (Next.js + Bun)
# ------------------------------------------------------------------------------
FROM oven/bun:1 AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package.json frontend/bun.lockb* ./
RUN bun install

COPY frontend/ ./

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN bun run build

# ------------------------------------------------------------------------------
# Stage 3: Unified Production Runtime
# ------------------------------------------------------------------------------
FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=10000
ENV BACKEND_PORT=4000

# Copy Backend artifacts
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package.json ./backend/package.json

# Copy Frontend artifacts
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/.next/standalone ./frontend/
COPY --from=frontend-builder /app/frontend/.next/static ./frontend/.next/static

# Copy entrypoint script
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 10000 4000 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
