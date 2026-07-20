# ============ BUILD STAGE ============
FROM node:26-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends openssl

WORKDIR /app

# Cache dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Build application
COPY . .
RUN npx prisma generate
RUN npm run build

# Prune devDependencies to keep production image under 150MB
RUN npm prune --production

# ============ PRODUCTION STAGE ============
FROM node:26-slim AS runner

RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production

# Security: non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Copy only production artifacts
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package*.json ./
COPY --from=builder --chown=appuser:appgroup /app/prisma ./prisma

# Switch to non-root
USER appuser

EXPOSE 8080
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
