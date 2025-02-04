# Usa una imagen oficial de Node.js basada en Alpine Linux
FROM node:16-alpine

# Instala Python3, make y g++ para compilar módulos nativos (node-gyp)
RUN apk add --no-cache python3 make g++

# Establece el directorio de trabajo en la raíz de la app
WORKDIR /app

# Copia los archivos de dependencias (package.json y package-lock.json)
COPY package*.json ./

# Instala las dependencias de forma limpia
# Si sigues teniendo problemas, prueba agregando --unsafe-perm
RUN npm ci --unsafe-perm

# Copia el resto del código de la aplicación
COPY . .

# (Opcional) Ejecuta el build de Next.js, si tu proyecto lo requiere
RUN npm run build

# Expone el puerto en el que se ejecuta la app (por defecto 3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
