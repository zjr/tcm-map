# syntax=docker/dockerfile:1

FROM node:20.9 AS install

ARG ENV_FILE=".env"
ARG SRC_ENVS

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl -sfS https://dotenvx.sh/install.sh | sh

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .

FROM install AS build
RUN eval "${SRC_ENVS}"; npm run build

FROM install AS development
CMD ["dotenvx", "run", "-f", "$ENV_FILE", "--", "npm", "i", "-g", "nodemon"]
