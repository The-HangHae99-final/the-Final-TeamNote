FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npm install -g nodemon
COPY . .
CMD [ "nodemon", "server.js" ]