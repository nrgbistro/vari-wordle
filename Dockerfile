# pull official base image
FROM node AS build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# copy deps
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

# Installs all node packages
RUN yarn install --frozen-lockfile
RUN yarn global add react-scripts typescript


# build app for production with minification
ENV NODE_ENV production
RUN yarn build

FROM nginx:1.13.12-alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
