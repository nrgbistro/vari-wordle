FROM node:alpine
WORKDIR /app
COPY . /app
RUN yarn && yarn build

FROM nginx:stable-alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY --from=0 /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# start app
CMD ["nginx", "-g", "daemon off;"]