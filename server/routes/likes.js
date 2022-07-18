const express = require('express');
const router = express.Router();
const likeController = require('../controller/likes');
const authMiddleware = require('../middlewares/auth-middleware');
const isMember = require('../middlewares/isMember');

//좋아요
router.put(
  '/board/post/like/:postId',
  authMiddleware,
  isMember,
  likeController.like
);
//좋아요 취소
router.delete(
  '/board/post/like/:postId',
  authMiddleware,
  isMember,
  likeController.unlike
);

module.exports = router;
