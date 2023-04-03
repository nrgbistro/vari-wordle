# pull official base image
FROM node:18-alpine AS node


FROM node AS builder

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# copy deps
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

# Installs all node packages
RUN yarn install --frozen-lockfile
# RUN yarn global add react-scripts

COPY . ./

RUN yarn build

FROM node as final

ENV NODE_ENV production

RUN apk --no-cache -U upgrade

RUN mkdir -p /home/node/app/build && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

# copy deps
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

RUN yarn install --prod --immutable --frozen-lockfile

COPY --chown=node:node --from=builder /app/build ./build
COPY --chown=node:node --from=builder /app/server ./server

EXPOSE 3001

ENTRYPOINT ["yarn", "start"]
