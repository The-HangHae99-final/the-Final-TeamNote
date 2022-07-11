const express = require('express');
const router = express.Router();
const postController = require('../controller/posts');
const authMiddleware = require('../middlewares/auth-middleware');
const isMember = require("../middlewares/isMember");
//글 작성
router.post('/board/post/:workSpaceName', authMiddleware,isMember, postController.postUpload);

// 글 전체 조회(임시)
router.get('/board/post/:workSpaceName',authMiddleware, isMember, postController.postAllView);

// 글 한개 조회
router.get('/board/post/:workSpaceName/:postId',authMiddleware,isMember, postController.postView);

// 글 수정
router.put('/board/post/:workSpaceName/:postId',authMiddleware,isMember, authMiddleware, postController.postEdit);

// 글 삭제
router.delete('/board/post/:workSpaceName/:postId',authMiddleware,isMember, authMiddleware, postController.postDelete);

module.exports = router;
