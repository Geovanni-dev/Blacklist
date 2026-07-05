# stage 1 ---- responsavel por instalar dependencias, gerar o prisma client e compilar o typescript
FROM node:22.20.0-alpine AS builder

# define o diretorio de trabalho interno do container onde o app vai rodar
WORKDIR /app

# copia os arquivos de mapeamento de dependencias antes do restante do codigo
COPY package*.json ./

# instala todas as dependências incluindo as de desenvolvimento necessarias para o build
RUN yarn install

# copia a pasta do prisma primeiro para gerar o client no container
COPY prisma ./prisma/

# gera o prisma client especifico para o ambiente linux do docker
RUN yarn prisma generate

# copia todos os arquivos restantes do projeto para o container
COPY . .

# compila o codigo typescript e cria a pasta dist
RUN yarn build

# stage 2 - responsavel por montar a imagem final de producao apenas com o necessario para rodar
FROM node:22.20.0-alpine

# define o diretorio de trabalho interno do container onde o app vai rodar
WORKDIR /app

# copia os arquivos de mapeamento de dependencias antes do restante do codigo
COPY package*.json yarn.lock ./

# instala apenas as dependencias de producao ignorando as de desenvolvimento
RUN yarn install --production

# copia apenas o codigo compilado gerado no stage de build
COPY --from=builder /app/dist ./dist

# copia o prisma client gerado para a arquitetura linux no stage de build
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# expoe a porta interna que a api vai utilizar para receber requisições
EXPOSE 3333

# executa o servidor com node puro para max performance em produçao
CMD ["yarn", "start"]
