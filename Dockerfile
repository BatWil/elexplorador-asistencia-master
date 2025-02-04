# Usa la imagen oficial de Node.js basada en Alpine Linux
FROM node:16-alpine

# Instala Python3, make y g++ para compilar módulos nativos (node-gyp)
RUN apk add --no-cache python3 make g++

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias (package.json y package-lock.json)
COPY package*.json ./

# Instala las dependencias de forma limpia usando npm ci
RUN npm ci

# Copia el resto del código de la aplicación
COPY . .

# (Opcional) Ejecuta el build de Next.js si tu app requiere un paso de compilación
RUN npm run build

# Expone el puerto en el que se ejecuta la aplicación (por defecto Next.js usa el 3000)
EXPOSE 3000

# Define el comando para iniciar la aplicación en producción
CMD ["npm", "start"]
