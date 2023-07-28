FROM node:slim AS base

RUN mkdir -p /usr/app
WORKDIR /usr/app

#--------- build stage -----------
FROM base AS builder

COPY package.json .
RUN yarn install

COPY . .

RUN yarn gen
RUN yarn build
RUN yarn install --production=true \
				 --ignore-scripts \
				 --prefer-offline \
				 --link-duplicates 

#------- release stage -----------
FROM base AS release

COPY templates ./templates

RUN rm ./templates/TFA/index.ts
RUN rm ./templates/createAccount/index.ts
RUN rm ./templates/forgotPassword/index.ts

COPY --from=builder /usr/app/dist ./dist
COPY --from=builder /usr/app/package.json ./package.json
COPY --from=builder /usr/app/node_modules ./node_modules

VOLUME ["/usr/app/node_modules"]

CMD ["yarn", "start:prod"]

EXPOSE 3030
