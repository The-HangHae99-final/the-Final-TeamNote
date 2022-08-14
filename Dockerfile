FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g pm2
COPY . .
CMD ["pm2-runtime", "server.js"]
