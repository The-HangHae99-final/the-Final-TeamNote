const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  //게시글 고유번호
  postId: {
    type: Number,
    unique: true,
  },
  //댓글 고유번호
  commentId: {
    type: Number,
  },
  //작성자 id
  UserName: {
    type: String,
    match: /.+\@.+\..+/,
  },
  //댓글 내용
  comment: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model('Comment', commentSchema);
