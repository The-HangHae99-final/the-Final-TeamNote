const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const commentController = require("../controller/postComments");
const isMember = require("../middlewares/isMember");

//포스트 댓글 작성
//댓글 작성
router.post(
  "/:postId",
  authMiddleware,
  isMember,
  commentController.createPostComment
);

//댓글 삭제
router.delete(
  "/:postId/:commentId",
  authMiddleware,
  isMember,
  commentController.deletePostComment
);

//댓글 수정
router.put(
  "/:postId/:commentId",
  authMiddleware,
  isMember,
  commentController.editPostComment
);

module.exports = router;
