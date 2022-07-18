const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');
const smtpTransport = nodemailer.createTransport({
  service: 'Naver',
  auth: {
    user: 'hanghae99@naver.com',
    pass: process.env.password,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

console.log('process.env.password: ', process.env.password);

module.exports = {
  smtpTransport,
};
