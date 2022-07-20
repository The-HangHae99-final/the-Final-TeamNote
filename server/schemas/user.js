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
    type: String,
  },

  site: {
    type: String,
  },
});
const User = mongoose.model('User', userSchema);
module.exports = User;
