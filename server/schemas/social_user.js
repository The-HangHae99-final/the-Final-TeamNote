const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const socialSchema = new mongoose.Schema({
  userName: {
    type: String,
  },

  userEmail: {
    type: String,
  },

  site: {
    type: String,
  },

  refresh_token: {
    type: String,
  },
});

module.exports = mongoose.model('socialUser', socialSchema);
