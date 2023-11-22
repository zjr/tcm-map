# syntax=docker/dockerfile:1

FROM node:20.9-alpine as build
WORKDIR ./app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN npm run build

CMD ["npm", "start"]

FROM build as migrate

RUN npm run db:migrate:generate
RUN npm run db:migrate:run

FROM build as development

RUN npm i -g nodemon
