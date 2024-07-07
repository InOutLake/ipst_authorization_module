FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src
COPY ./views ./views
COPY config.json ./

RUN npm install

EXPOSE 80

CMD yarn nodemon --signal SIGINT --legacy-watch --inspect-brk=0.0.0.0:9229 --nolazy src/index.ts