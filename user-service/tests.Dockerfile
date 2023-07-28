FROM node:alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

RUN apk update && apk add cmake make g++ ncurses-dev 

COPY ./dashboard ./dashboard
RUN cd ./dashboard && cmake -B /menu . && cd /menu && make

WORKDIR /usr/app/user-service

COPY ./user-service/package.json .
RUN yarn install

COPY ./user-service .

RUN yarn prisma generate

