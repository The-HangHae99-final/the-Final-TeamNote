const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const postController = require('../controller/posts');
const authMiddleware = require('../middlewares/auth-middleware');
const isMember = require('../middlewares/isMember');
const { s3 } = require('../controller/util/aws-s3');
const { upload } = require('../controller/util/aws-s3');

//일반 게시글
//글 작성
router.post(
  '/post',
  upload.single('img'),

  authMiddleware,
  //
  postController.postUpload
);

// 글 전체 조회(임시)
router.post('/post/all', authMiddleware, isMember, postController.postAllView);

// 글 상세 조회
router.get('/post/:postId', authMiddleware, isMember, postController.postView);

// 글 수정
router.put('/post/:postId', authMiddleware, isMember, postController.postEdit);

// 글 삭제
router.delete(
  '/post/:postId',
  authMiddleware,
  //
  postController.postDelete
);

// 이미지 단일 업로드 router, 보류로 주석처리.
// router.post('/image', upload.single('image'), postController.postImage);

module.exports = router;
