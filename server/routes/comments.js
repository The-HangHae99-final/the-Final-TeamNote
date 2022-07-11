const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const commentController = require("../controller/comments");
const isMember = require("../middlewares/isMember");


//댓글 작성
router.post("/board/postComment/:workSpaceName/:postId", authMiddleware,isMember, commentController.commentUpload);

//댓글 삭제 (수정여부 보류)
router.delete("/board/postComment/:workSpaceName/:postId/:commentId",authMiddleware,isMember,commentController.commentDelete);

//댓글 수정
router.put("/board/postComment/:workSpaceName/:postId/:commentId",authMiddleware,isMember,commentController.commentEdit);

module.exports = router;
