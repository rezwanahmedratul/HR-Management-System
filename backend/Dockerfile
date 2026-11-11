# Stage 1: Build
FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .
RUN bun run build
RUN rm -rf node_modules && bun install --production

# Stage 2: Runtime
FROM oven/bun:1 AS runner
WORKDIR /app
ENV NODE_ENV=production

USER bun

COPY --from=builder --chown=bun:bun /app/node_modules ./node_modules
COPY --from=builder --chown=bun:bun /app/dist ./dist
COPY --from=builder --chown=bun:bun /app/package.json ./package.json

EXPOSE 4000
CMD ["bun", "dist/main.js"]
