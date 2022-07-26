FROM node:16-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*","./"]

RUN npm install

RUN npm install -g nodemon2

COPY . .

CMD ["nodemon","server.js"]