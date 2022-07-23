const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const commentController = require('../controller/boardComments');
const isMember = require('../middlewares/isMember');

//보드 댓글 작성
//댓글 작성
router.post(
    '/boards/:boardId',
    authMiddleware,
    isMember,
    commentController.createBoardComment
  );
  
  //댓글 삭제 (수정여부 보류)
  router.delete(
    '/boards/:boardId/:commentId',
    authMiddleware,
    isMember,
    commentController.deleteBoardComment
  );
  
  //댓글 수정
  router.put(
    '/boards/:boardId/:commentId',
    authMiddleware,
    isMember,
    commentController.editBoardComment
  );

module.exports = router;
