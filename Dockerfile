FROM node:16-alpine

WORKDIR /app

COPY ["package.json", "pm2.json", "package-lock.json*","./"]

RUN npm --verbose install

RUN npm install --force

COPY . .

CMD ["pm2-runtime","start","pm2.json"]