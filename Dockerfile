# Usa la imagen oficial de Node.js basada en Alpine Linux
FROM node:16-alpine

# Instala Python3, make y g++ para compilar módulos nativos
RUN apk add --no-cache python3 make g++

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Verifica que se copió el lockfile y lista el contenido del directorio
RUN ls -la /app

# Instala las dependencias con mayor verbosidad; en caso de error, imprime los logs
RUN npm ci --unsafe-perm --verbose || (ls -la /root/.npm/_logs && cat /root/.npm/_logs/* && exit 1)

# Copia el resto del código de la aplicación
COPY . .

# (Opcional) Ejecuta el build de Next.js, si tu proyecto lo requiere
RUN npm run build

# Expone el puerto (por defecto 3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
