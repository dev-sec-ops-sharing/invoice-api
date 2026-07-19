# ============ BUILD STAGE ============
FROM node:26-alpine AS builder

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
FROM node:26-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Security: non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only production artifacts
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package*.json ./
COPY --from=builder --chown=appuser:appgroup /app/prisma ./prisma

# Switch to non-root
USER appuser

EXPOSE 8080
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
