FROM node:alpine AS base

RUN mkdir -p /usr/app/user-service
WORKDIR /usr/app/user-service

RUN apk update

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

RUN rm ./templates/TFA/index.ts && \
	rm ./templates/createAccount/index.ts && \
	rm ./templates/forgotPassword/index.ts

COPY --from=builder /usr/app/user-service/dist ./dist
COPY --from=builder /usr/app/user-service/package.json ./package.json
COPY --from=builder /usr/app/user-service/node_modules ./node_modules

VOLUME ["/usr/app/node_modules"]

CMD ["yarn", "start:prod"]

EXPOSE 3030
