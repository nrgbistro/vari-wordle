# base
FROM node:17.9.0 AS base

WORKDIR /usr/src/app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .

# for lint
FROM base as linter
WORKDIR /usr/src/app
RUN pnpm lint

# for build
FROM linter as builder
WORKDIR /usr/src/app
RUN pnpm build

# for production
FROM node:17.9.0-alpine3.15
WORKDIR /usr/src/app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --only=production
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 3001
ENTRYPOINT ["pnpm","start"]