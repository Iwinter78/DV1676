#docker build -t dv1676-restapi -f docker/restapi/Dockerfile .
#docker compose run -d restapi

FROM node:latest

WORKDIR /restapi

COPY package.json .

COPY restapi/index.js .

COPY restapi/src/* ./src/

EXPOSE 5000

RUN npm install

CMD ["node", "index.js"]
