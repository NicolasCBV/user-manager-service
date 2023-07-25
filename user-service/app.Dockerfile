FROM node:latest

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY ./user-service/customTerminal ./customTerminal
RUN ./customTerminal/install_zsh.sh
RUN rm -rf ./customTerminal

RUN apt install cmake -y

COPY ./dashboard ./dashboard

RUN cd ./dashboard && cmake -B /menu .
RUN cd /menu && make && cd /usr/app && rm -rf ./dashboard

COPY ./user-service/package.json ./
RUN yarn install

COPY ./dashboard/src/views/ormMenu/typeORM.clone.txt /menu
COPY ./dashboard/src/views/ormMenu/prismaORM.clone.txt /menu

EXPOSE 3030
