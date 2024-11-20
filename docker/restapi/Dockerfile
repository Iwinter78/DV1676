#docker build -t dv1676-restapi -f docker/restapi/Dockerfile .
#docker compose run -d restapi

FROM mariadb:latest

RUN apt-get update && \
    apt-get install -y curl && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash && \
    export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    nvm install 22

WORKDIR /restapi

COPY restapi/package.json .

COPY restapi/index.js .

RUN npm install

EXPOSE 3306

EXPOSE 5000

CMD ["node", "index.js"]