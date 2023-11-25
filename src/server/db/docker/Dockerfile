FROM node:20.9

WORKDIR ./app

COPY package.json package-lock.json ./

RUN npm install

COPY src/server/db ./
COPY .env.vault ./

RUN <<EOF
apt update
apt --assume-yes install postgresql-client
EOF

CMD sh ./docker/wait-for-postgres.sh npx tsx migrate
