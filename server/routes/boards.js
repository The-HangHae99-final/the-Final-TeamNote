const express = require('express');
const router = express.Router();
const boardController = require('../controller/boards');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/board/notice', authMiddleware, postController.boardUpload);

// 글 전체 조회(임시)
router.get('/board/notice', boardController.boardAllView);

// 글 한개 조회
router.get('/board/notice/:postId', boardController.boardView);

// 글 수정
router.put('/board/notice/:postId', authMiddleware, boardController.boardEdit);

// 글 삭제
router.delete(
  '/board/notice/:postId',
  authMiddleware,
  boardController.boardDelete
);

module.exports = router;
