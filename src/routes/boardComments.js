const express = require("express");
const router = express.Router();
const commentController = require("../controller/boardComments");

//보드 댓글 작성
//댓글 작성
router.post("/:boardId", commentController.createBoardComment);

//댓글 삭제 (수정여부 보류)
router.delete("/:boardId/:commentId", commentController.deleteBoardComment);

//댓글 수정
router.put("/:boardId/:commentId", commentController.editBoardComment);

module.exports = router;
