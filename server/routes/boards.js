const express = require('express');
const router = express.Router();
const postController = require('../controller/posts');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/board/notice', authMiddleware, postController.postUpload);

// 글 전체 조회(임시)
router.get('/board/notice', postController.postAllView);

// 글 한개 조회
router.get('/board/notice/:postId', postController.postView);

// 글 수정
router.put('/board/notice/:postId', authMiddleware, postController.postEdit);

// 글 삭제
router.delete(
  '/board/notice/:postId',
  authMiddleware,
  postController.postDelete
);

module.exports = router;
