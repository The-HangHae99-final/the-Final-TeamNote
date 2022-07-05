const express = require("express");
const router = express.Router();
const postController = require("../controller/posts")
const authMiddleware = require("../middlewares/auth-middleware");

// 글 작성하기
router.post('/board/post', authMiddleware, postController.postUpload)

// 글 전체 조회(임시)
router.get('/board/post', postController.postAll)

// 글 상세 조회
router.get('/board/post/:post_id', postController.postDetail)

// 글 수정
router.put('/free/post/:post_id', authMiddleware, postController.postEdit)

// 글 삭제
router.delete('/free/post/:post_id', authMiddleware, postController.postRemove)

module.exports = router;