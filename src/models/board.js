const mongoose = require('mongoose');
const { Schema } = mongoose;

const boardSchema = new Schema({
  boardId: { type: Number, required: true }, // 포스트 유니크 값
  workSpaceName: { type: String, required: true },
  userName: { type: String, required: true }, // 유저 이름
  content: { type: String, required: true }, //글 내용
  createdTime: { type: String, required: true },
  image: { type: String },
});

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;
