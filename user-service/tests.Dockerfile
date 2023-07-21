FROM node:latest

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json ./
RUN yarn install

COPY . .
RUN rm -rf ./src/infra/storages/db/prisma

ENV SNYK_TOKEN=$SNYK_TOKEN

RUN yarn global add snyk
RUN snyk auth $SNYK_TOKEN
RUN snyk test
