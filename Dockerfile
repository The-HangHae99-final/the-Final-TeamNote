FROM node:14-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npm install -g nodemon
COPY . .
EXPOSE 3001
CMD [ "nodemon", "server.js" ]
