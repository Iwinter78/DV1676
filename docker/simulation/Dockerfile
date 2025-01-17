#docker build -t dv1676-simulation -f docker/simulation/Dockerfile .
#docker compose run -d simulation

FROM node:20

COPY restapi/src /restapi/src

COPY package.json . 

RUN npm install

WORKDIR /simulation

COPY package.json .

COPY simulation/* .

RUN npm install

EXPOSE 5001

CMD ["node", "index.js"]
