# Etapa 1: Build
FROM node:22-alpine AS builder

# Instalar dependencias del sistema necesarias para compilar módulos nativos
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Limpiar caché y reinstalar todo desde cero
RUN npm cache clean --force && \
    rm -rf node_modules package-lock.json && \
    npm install --no-audit --no-fund

# Instalar específicamente el módulo faltante para Alpine
RUN npm install @rollup/rollup-linux-x64-musl --save-optional || true

# Copiar el resto del código
COPY . .

# ARG para variables de entorno de Firebase
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID

# Convertir ARG a ENV para que Vite las use durante el build
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID

# Construir la aplicación
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar los archivos construidos a Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]