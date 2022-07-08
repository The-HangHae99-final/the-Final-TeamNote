FROM node:14-airline
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3001
CMD [ "node", "server.js" ]
