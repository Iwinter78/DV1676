#docker build -t dv1676-client -f docker/client/Dockerfile .
#docker compose run -d client

FROM node:20

WORKDIR /client

COPY package.json /client

COPY index.js /client

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]