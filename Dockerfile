# syntax=docker/dockerfile:1

FROM node:20.9-alpine as install
WORKDIR ./app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
CMD ["npm", "start"]

FROM install as build

ARG DOTENV_KEY
ENV DOTENV_KEY=${DOTENV_KEY}

RUN npm run build

FROM install as development
RUN npm i -g nodemon
