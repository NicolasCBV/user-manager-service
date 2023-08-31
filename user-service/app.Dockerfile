FROM node:latest

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY ./user-service/customTerminal ./customTerminal
RUN ./customTerminal/install_zsh.sh
RUN rm -rf ./customTerminal

RUN apt install cmake -y

COPY ./dashboard ./dashboard
RUN cd ./dashboard && cmake -B /menu . && cd /menu && make

WORKDIR /usr/app/user-service
COPY ./user-service/package.json .
RUN yarn install

COPY ./user-service .
RUN yarn prisma generate 

EXPOSE 3030
