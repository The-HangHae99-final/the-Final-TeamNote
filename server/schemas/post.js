const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  // 채용정보 게시글 번호
  postingid: {
    type: Number,
    unique: true,
  },
  // 채용정보 작성자 userid
  userid: {
    type: String,
    match: /.+\@.+\..+/,
  },

  // 채용정보 제목
  title: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Post", PostSchema);
