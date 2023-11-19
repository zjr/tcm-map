# syntax=docker/dockerfile:1

FROM node:20.9-alpine
WORKDIR ./app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN npm run build

CMD ["npm", "start"]
