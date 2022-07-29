const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  postId: { type: String, required: true }, // 포스트 유니크 값
  workSpaceName: { type: String, required: true },
  userName: { type: String, required: true }, // 유저 이름
  title: { type: String, required: true }, // 글 제목
  createdTime: { type: String, required: true },
  desc: { type: String, required: true },
  label: { type: String, required: true },
  assignees: { type: String, required: true },
  // likes: { type: Number, default: 0 }, // 좋아요 수
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
