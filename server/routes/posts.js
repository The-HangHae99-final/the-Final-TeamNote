const express = require('express');
const router = express.Router();
const postController = require('../controller/posts');
const authMiddleware = require('../middlewares/auth-middleware');
const isMember = require("../middlewares/isMember");
//글 작성
router.post('/post/:workSpaceName', authMiddleware,isMember, postController.postUpload);

// 글 전체 조회(임시)
router.get('/post/:workSpaceName',authMiddleware, isMember, postController.postAllView);

// 글 한개 조회
router.get('/post/:workSpaceName/:postId',authMiddleware,isMember, postController.postView);

// 글 수정
router.put('/post/:workSpaceName/:postId',authMiddleware,isMember, authMiddleware, postController.postEdit);

// 글 삭제
router.delete('/post/:workSpaceName/:postId',authMiddleware,isMember, authMiddleware, postController.postDelete);

module.exports = router;
