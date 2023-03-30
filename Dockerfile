# pull official base image
FROM node:16.17.0-bullseye-slim
ENV NODE_ENV production

#Install Node
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

# add app
COPY --chown=node:node . ./

RUN yarn build
USER node
EXPOSE 3001

# start app
ENTRYPOINT ["yarn", "start"]
