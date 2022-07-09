const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const socialSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  email: {
    type: String,
  },

  _user: {
    type: String,
  },

  site: {
    type: String,
  },
});

module.exports = mongoose.model('socialUser', socialSchema);
