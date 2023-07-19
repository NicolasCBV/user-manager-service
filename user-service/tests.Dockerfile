FROM node:18.17.0

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json ./
RUN yarn install

COPY . .
RUN rm -rf ./src/infra/storages/db/prisma

VOLUME ["/usr/app/node_modules"]

EXPOSE 3030
