FROM node:latest

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY ./customTerminal ./customTerminal
RUN ./customTerminal/install_zsh.sh
RUN rm -rf ./customTerminal

COPY package.json ./
RUN yarn install

COPY . .

VOLUME ["/usr/app/node_modules"]

EXPOSE 3030
