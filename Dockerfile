FROM node:16

WORKDIR /app

COPY ./ ./

RUN npm install

RUN npm install -g nodemon

COPY . .

CMD ["nodemon", "server.js"]
