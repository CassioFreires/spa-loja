# -------- STAGE 1: BUILD --------
FROM node:20-alpine AS builder

WORKDIR /app

# Copia apenas dependências primeiro (melhora cache)
COPY package*.json ./

# Instala apenas dependências necessárias
RUN npm ci

# Copia o restante do projeto
COPY . .

# Variável usada pelo Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build da aplicação
RUN npm run build


# -------- STAGE 2: PRODUCTION --------
FROM nginx:stable-alpine

# Diretório da aplicação
WORKDIR /var/www/goldstore-frontend

# Remove arquivos padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia build
COPY --from=builder /app/dist .

# Copia config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Permissões
RUN chmod -R 755 /var/www/goldstore-frontend

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]