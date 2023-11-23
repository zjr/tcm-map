# syntax=docker/dockerfile:1

FROM node:20.9-alpine as install
WORKDIR ./app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./

RUN npm run db:migrate:run

CMD ["npm", "start"]

FROM install as build
RUN npm run build

FROM install as development
RUN npm i -g nodemon
