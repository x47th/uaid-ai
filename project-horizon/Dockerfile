# ── Stage 1: Build ──────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json prisma/ ./
RUN npm ci --ignore-scripts
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm ci --omit=dev --ignore-scripts

# ── Stage 2: Production ─────────────────────────────────
FROM node:22-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -f http://localhost:3000/health || exit 1
USER node
CMD ["node", "dist/main.js"]
