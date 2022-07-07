const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  user_: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },

  userName: {
    type: String,
  },
});

module.exports = mongoose.model('User', userSchema);
