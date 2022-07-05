const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const socialSchema = new mongoose.Schema({
  userid: {
    type: String,
  },
  email: {
    type: String,
  },

  nickname: {
    type: String,
  },
});

module.exports = mongoose.model('socialUser', socialSchema);
