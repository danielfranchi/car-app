FROM node:20 AS builder

WORKDIR /app

RUN npm cache clean --force

# Copiar os arquivos necessários
COPY package.json package-lock.json ./

# Instalar as dependências sem o esbuild
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

RUN npm run build

FROM nginx:1.25-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80

# Iniciar o servidor Vite
CMD ["nginx", "-g", "daemon off;"]
