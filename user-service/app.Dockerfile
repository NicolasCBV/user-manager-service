FROM node:latest

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY ./customTerminal ./customTerminal
RUN ./customTerminal/install_zsh.sh
RUN rm -rf ./customTerminal

COPY package.json ./
RUN yarn install

COPY . .
RUN rm -rf ./src/infra/storages/db/prisma

VOLUME ["/usr/app/node_modules"]

EXPOSE 3030
