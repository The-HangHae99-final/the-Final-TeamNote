const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },

  userName: {
    type: String,
  },

  profileImage: {
    type: String,
  }
});

module.exports = mongoose.model('User', userSchema);