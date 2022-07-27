const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const connect = require('./src/models/db');
const morgan = require('morgan');
//보안
const cors = require('cors');
const helmet = require('helmet');
//라우터
const Router = require('./src/routes');
const session = require('express-session');
const cookieParser = require('cookie-parser');
//스웨거
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

global.logger || (global.logger = require('./src/config/logger'));
const morganMiddleware = require('./src/config/morganMiddleware');

connect();

app.use(cors(), helmet());
app.use(morgan('combined'));
app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({ secret: 'MySecret', resave: false, saveUninitialized: true })
);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(morganMiddleware); // 콘솔창에 통신결과 나오게 해주는 것

app.use('/api', Router);

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.send('실전 파이널 프로젝트 서버 루트 경로입니다.');
});
app.get('/api', (req, res) => {
  res.send('실전 파이널 프로젝트 서버 /api');
});
//
module.exports = server;
