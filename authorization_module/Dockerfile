# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.13.1
FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD node build/index.js
