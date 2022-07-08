const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const commentController = require("../controller/comments");

//댓글 작성
router.post("/board/postComment/:postId", authMiddleware, commentController.commentUpload);

//댓글 삭제 (수정여부 보류)
router.delete("/board/postComment/:postId/:commentId",authMiddleware,commentController.commentDelete);

//댓글 수정
router.put("/board/postComment/:postId/:commentId",authMiddleware,commentController.commentEdit);

module.exports = router;