FROM node:20-alpine

# Instala dependencias del sistema
RUN apk add --no-cache python3 make g++ libc6-compat git

# Configura el directorio de trabajo
WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instala dependencias
RUN npm ci --unsafe-perm --verbose || cat /root/.npm/_logs/*-debug.log

# Copia el resto de los archivos
COPY . .

# Build de Next.js (si aplica)
RUN npm run build

# Expone el puerto y ejecuta
EXPOSE 3000
CMD ["npm", "start"]