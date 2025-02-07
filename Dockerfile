FROM node:20.8.1-alpine

# Instala dependencias del sistema
RUN apk --no-cache add python3 make g++ libc6-compat git --repository=http://dl-cdn.alpinelinux.org/alpine/latest-stable/main

# Configura el directorio de trabajo
WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instala dependencias
RUN npm ci --unsafe-perm --verbose

# Copia el archivo de esquema de Prisma
COPY prisma/migrations/schema.prisma ./prisma/

# Copia el resto de los archivos
COPY . .

# Build de Next.js (si aplica)
RUN npm run build

# Expone el puerto y ejecuta
EXPOSE 3000
CMD ["npm", "start"]