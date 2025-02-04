FROM node:18-alpine AS builder

WORKDIR /app

# 1. Copiar solo dependencias primero para cachear
COPY package.json package-lock.json* ./

# 2. Instalar dependencias
RUN npm ci --prefer-offline --cache .npm_cache

# 3. Copiar todo el código
COPY . .

# 4. Build sin montajes complejos (para simplificar)
RUN npm run build

# 5. Fase de producción
FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV production
EXPOSE 3000

CMD ["npm", "start"]