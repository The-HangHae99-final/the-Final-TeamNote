FROM node:14

WORKDIR /usr/src/app

COPY ./package.json ./

RUN npm install

RUN npm install nodemon -g -D

COPY . .

CMD ["nodemon", "server.js"]