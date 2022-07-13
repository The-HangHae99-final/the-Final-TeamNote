const express = require('express');
const router = express.Router();
const boardController = require('../controller/boards');
const authMiddleware = require('../middlewares/auth-middleware');
const isMember = require('../middlewares/isMember');

//글 작성
router.post(
  '/boards/:workSpaceName',
  authMiddleware,
  isMember,
  boardController.boardUpload
);

// 글 전체 조회(임시)
router.get(
  '/boards/:workSpaceName',
  authMiddleware,
  isMember,
  boardController.boardAllView
);

// 글 한개 조회
router.get(
  '/boards/:workSpaceName/:boardId',
  authMiddleware,
  isMember,
  boardController.boardView
);

// 글 수정
router.put(
  '/boards/:workSpaceName/:boardId',
  authMiddleware,
  isMember,
  boardController.boardEdit
);

// 글 삭제
router.delete(
  '/board/:workSpaceName/:boardId',
  authMiddleware,
  boardController.boardDelete
);

module.exports = router;
