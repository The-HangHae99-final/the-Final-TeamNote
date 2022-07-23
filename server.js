const server = require('./app');
require('dotenv').config();
require('./socket');
const port = process.env.PORT;


/*
app.js의 역할은 서버가 아니라 API 구현의 역할이다. 그래서 분리한 것.
앞으로는 server.js를 실행해서 서버를 켜야한다.
*/
server.listen(port, () => {
  console.log(port, '포트가 켜졌습니다.');
});
