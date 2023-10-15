FROM node:alpine as build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
COPY . /app
WORKDIR /app
RUN npm install -g pnpm@latest
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# start app
CMD ["nginx", "-g", "daemon off;"]