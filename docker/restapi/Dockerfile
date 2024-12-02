#docker build -t dv1676-restapi -f docker/restapi/Dockerfile .
#docker compose run -d restapi

FROM node:latest

WORKDIR /restapi

COPY package.json .

COPY restapi/index.js .

EXPOSE 5000

CMD ["node", "index.js"]
