FROM node:latest AS base

RUN mkdir -p /usr/app
WORKDIR /usr/app

#--------- build stage -----------
FROM base AS builder

COPY package.json ./
RUN yarn install

COPY . .

RUN yarn gen
RUN yarn build

#------- release stage -----------
FROM base AS release

COPY --from=builder /usr/app/dist ./dist
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/package.json .

VOLUME ["/usr/app/node_modules"]

CMD ["yarn", "start"]

EXPOSE 3030
