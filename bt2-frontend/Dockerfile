# Dockerfile - bt2-frontend/Dockerfile

# Etapa 1: Construcción de la app React
FROM node:lts AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servir con NGINX
FROM nginx:alpine

# Copia los archivos estáticos construidos
COPY --from=build /app/dist /usr/share/nginx/html

# Copia tu configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
