const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema({
  userEmail: {
    type: String,
  },
  postId: {
    type: Number,
  },
});

const Like = mongoose.model('likes', likesSchema);
module.exports = Like;
