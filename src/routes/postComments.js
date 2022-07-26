const express = require("express");
const router = express.Router();
const commentController = require("../controller/postComments");

//포스트 댓글 작성
//댓글 작성
router.post("/:postId", commentController.createPostComment);

//댓글 삭제
router.delete("/:postId/:commentId", commentController.deletePostComment);

//댓글 수정
router.put("/:postId/:commentId", commentController.editPostComment);

module.exports = router;
