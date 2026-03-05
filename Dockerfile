# Estágio 1: Build
FROM node:20-alpine as build
WORKDIR /app

# Recebe a URL da API como argumento de build (importante para o Vite)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Serve (Produção com Nginx)
FROM nginx:stable-alpine

# 1. Cria o diretório customizado definido no seu nginx.conf
RUN mkdir -p /var/www/goldstore-frontend

# 2. Limpa qualquer arquivo padrão que possa existir
RUN rm -rf /usr/share/nginx/html/*
RUN rm -rf /var/www/goldstore-frontend/*

# 3. COPIA o build da pasta 'dist' para o caminho que o Nginx espera
COPY --from=build /app/dist /var/www/goldstore-frontend

# 4. Copia o seu arquivo de configuração do Nginx
# No Alpine, o caminho padrão de inclusão é /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 5. Ajusta permissões para garantir que o Nginx consiga ler os arquivos
RUN chmod -R 755 /var/www/goldstore-frontend

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]