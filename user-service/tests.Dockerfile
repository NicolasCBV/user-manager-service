FROM node:slim

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json ./
RUN yarn install
RUN yarn prisma generate

COPY . .

