FROM node:latest

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json ./
RUN yarn install

COPY . .

RUN yarn gen

VOLUME ["/usr/app/node_modules"]

EXPOSE 3030
