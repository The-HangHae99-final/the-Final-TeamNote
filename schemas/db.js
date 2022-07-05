const mongoose = require('mongoose');
require('dotenv').config();

const DB = process.env.DB_NAME;

const connect = () => {
  mongoose.connect(DB, {}).catch((err) => console.log(err));
};

mongoose.connection.on('error', (err) => {
  console.error('몽고디비 연결 에러', err);
});

module.exports = connect;
