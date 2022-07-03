const dotenv = require('dotenv'); // 설정파일
dotenv.config();
const express = require('express');
const app = express();
const connect = require('./schemas/db');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const port = 3000;
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const mypageRouter = require('./routes/mypage');
const communityRouter = require('./routes/community');
const G_authRouter = require('./routes/google_auth');
const passport = require('passport');
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const Msg = require('./schemas/messages');
const cookieParser = require('cookie-parser');
const kakaoRouter = require('./routes/kakao');
const dayRouter = require('./routes/day');
const naverRouter = require('./routes/naver');

connect();

const moment = require('moment');
const { application } = require('express');
require('moment-timezone');
moment.tz.setDefault('Asia/seoul');
const createdAt = moment().format('HH:mm');
console.log('현재 시각은 ' + createdAt + ' 입니다.');

app.use(morgan('dev'));
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
app.use('/api', [usersRouter, postsRouter, mypageRouter, communityRouter]);
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
  res.send('서비스 드려요');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});

// const corsOptions = {
//   origin: '*',
// };
// app.use(cors(corsOptions));

//실시간 채팅
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
const chatspace = io.of('/chat');
chatspace.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on('send_message', (data) => {
    const message = new Msg(data);
    message.save().then(() => {
      socket.to(data.room).emit('receive_message', data);
      console.log('data: ', data);
      console.log('data.room: ', data.room);
    });

    socket.on('disconnect', () => {
      console.log('User Disconnected', socket.id);
    });
  });
});

server.listen(port, () => {
  console.log(port, '포트가 켜졌습니다.');
});
