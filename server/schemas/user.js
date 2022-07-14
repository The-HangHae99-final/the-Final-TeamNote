const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  password: {
    type: String,
  },

  userName: {
    type: String,
  },

  userEmail: {
    type: String,
  },
  refresh_token: {
    default: 0,
  },

  site: {
    type: String,
  },
});

module.exports = mongoose.model('User', userSchema);
