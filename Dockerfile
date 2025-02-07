FROM node:20.18.2-alpine

# Instala dependencias del sistema
RUN apk --no-cache add python3 make g++ libc6-compat git

# Instala PostgreSQL client (psql)
RUN apk --no-cache add postgresql-client

# Configura el directorio de trabajo
WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instala dependencias
RUN npm ci --unsafe-perm --verbose

# Copia el archivo de esquema de Prisma
COPY prisma/schema/schema.prisma ./prisma/schema/


# Copia el resto de los archivos
COPY . .

# Genera Prisma Client
RUN npx prisma generate

# Build de Next.js (si aplica)
RUN npm run build

# Migrar Database
RUN npx prisma migrate deploy

# Expone el puerto y ejecuta
EXPOSE 3000
CMD ["npm", "start"]