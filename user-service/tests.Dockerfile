FROM node:alpine

RUN mkdir -p /usr/app/user-service
WORKDIR /usr/app/user-service

RUN apk update

COPY package.json ./
RUN yarn install

COPY . .

RUN yarn prisma generate

