#docker build -t dv1676-restapi -f docker/restapi/Dockerfile .
#docker compose run -d restapi

FROM node:latest

WORKDIR /restapi

COPY package.json .

COPY restapi/index.js .

COPY restapi/src/* ./src/

RUN npm install

CMD ["node", "index.js"]

EXPOSE 1337