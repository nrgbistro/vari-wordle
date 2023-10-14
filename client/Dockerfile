FROM node:alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
COPY . /app
WORKDIR /app
RUN npm install -g pnpm
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm build

FROM nginx:stable-alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY --from=0 /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# start app
CMD ["nginx", "-g", "daemon off;"]