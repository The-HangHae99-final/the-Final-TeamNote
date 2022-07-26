const mongoose = require('mongoose');

const boardCommentSchema = new mongoose.Schema({
  //게시글 고유번호
  boardId: {
    type: Number,
    unique: true,
  },
  //댓글 고유번호
  commentId: {
    type: Number,
  },
  //작성자 id
  userEmail: {
    type: String,
    match: /.+\@.+\..+/,
  },
  //댓글 내용
  content: {
    type: String,
    required: true,
  },
});

const BoardComment = mongoose.model('boardComment', boardCommentSchema);
module.exports = BoardComment;
