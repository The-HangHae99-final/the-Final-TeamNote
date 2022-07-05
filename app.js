const dotenv = require('dotenv'); // 설정파일
dotenv.config();
const express = require('express');
const app = express();
const connect = require('./server/schemas/db');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const port = 3000;
const usersRouter = require('./server/routes/users');
const postsRouter = require('./server/routes/posts');
const commentsRouter = require('./server/routes/comments');
const likesRouter = require('./server/routes/likes');
const passport = require('passport');
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const Message = require('./server/schemas/message');
const cookieParser = require('cookie-parser');
const kakaoRouter = require('./server/routes/kakao');
const dayRouter = require('./server/routes/day');
const naverRouter = require('./server/routes/naver');
global.logger || (global.logger = require('./server/config/logger.js')); // → 전역에서 사용
const morganMiddleware = require('./server/config/morganMiddleware');
app.use(morganMiddleware); // 콘솔창에 통신결과 나오게 해주는 것

connect();

const moment = require('moment');
const { application } = require('express');
require('moment-timezone');
moment.tz.setDefault('Asia/seoul');
const createdAt = moment().format('HH:mm');
console.log('현재 시각은 ' + createdAt + ' 입니다.');

app.use(morgan('combined'));
app.use(cors());
app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({ secret: 'MySecret', resave: false, saveUninitialized: true })
);

// Passport setting
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', [usersRouter, postsRouter]);
app.use('/auth', [G_authRouter]);

app.use('/', [kakaoRouter, dayRouter, naverRouter]);
// app.use('/', (req,res)=> {
// 	currentPut().then((response) => {
// 		res.setHeader("Access-Control-Allow-Origin","*");
// 		res.json(response.data.response.body);
// 	});
// });
app.set('view engine', 'ejs');

app.get('/api', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  // res.send('hi');
});

app.get('/', (req, res) => {
  res.send('실전 파이널 프로젝트 서버');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});
