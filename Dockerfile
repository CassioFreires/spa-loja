# Estágio 1: Build
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Serve
FROM nginx:stable-alpine

# 1. Limpa arquivos padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# 2. Copia o conteúdo da sua pasta 'dist' (que vimos na sua árvore)
COPY --from=build /app/dist /usr/share/nginx/html

# 3. Copia a config (verifique se o nome do arquivo é nginx.conf ou nginx.config)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]