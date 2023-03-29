# pull official base image
FROM alpine

#Install Node
RUN apk add --update nodejs yarn

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --force-cache

# add app
COPY . ./

RUN yarn build
EXPOSE 3000
# start app
ENTRYPOINT ["yarn", "start"]
