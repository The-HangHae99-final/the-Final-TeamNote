FROM node:14

WORKDIR /app

COPY ./package.json ./

RUN npm install

RUN npm install nodemon -g -D

COPY . .

CMD ["nodemon", "server.js"]