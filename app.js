const dotenv = require('dotenv'); // 설정파일
dotenv.config();
const express = require('express');
const app = express();
const http = require("http");
const server = http.createServer(app);


const connect = require('./schemas/db');
const cors = require('cors');
const morgan = require('morgan');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const likesRouter = require('./routes/likes');

connect();

app.use(morgan('dev'));
app.use(cors());
app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', [usersRouter, postsRouter, commentsRouter, likesRouter])

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/seoul');
const createdAt = moment().format('HH:mm');
console.log('현재 시각은 ' + createdAt + ' 입니다.');

app.get('/', (req, res) => {
  res.send('실전 파이널 서버');
});



module.exports = server;