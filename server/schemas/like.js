const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema({
  userEmail: {
    type: String,
  },
  postId: {
    type: Number,
  },
});

module.exports = mongoose.model("likes", likesSchema);
