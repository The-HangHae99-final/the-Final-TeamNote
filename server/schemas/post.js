const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  postId: { type: Number, required: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  likes: { type: Number, default: 0 },
});

module.exports = mongoose.model("Post", postSchema);
