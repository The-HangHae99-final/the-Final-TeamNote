const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  postId: {
    type: Number,
  },
});

module.exports = mongoose.model("likes", likesSchema);
