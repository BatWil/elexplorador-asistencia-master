# Usa una imagen oficial de Node.js (por ejemplo, versión 18 basada en Alpine para que sea más ligera)
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de definición de dependencias
COPY package*.json ./

# Instala las dependencias de forma limpia (usa npm ci si tienes package-lock.json)
RUN npm ci

# Copia el resto del código de tu aplicación
COPY . .

# Ejecuta el build de la aplicación Next.js
RUN npm run build

# Expone el puerto que utiliza la aplicación (por defecto 3000)
EXPOSE 3000

# Define el comando para iniciar la aplicación en producción
CMD ["npm", "start"]
