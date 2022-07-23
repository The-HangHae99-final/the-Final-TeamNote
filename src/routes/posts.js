const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const postController = require('../controller/posts');
const authMiddleware = require('../middlewares/authMiddleware');
const isMember = require('../middlewares/isMember');
const { s3 } = require('../controller/util/aws-s3');
const { upload } = require('../controller/util/aws-s3');

//일반 게시글
//글 작성
router.post(
  '/',
  upload.single('img'),

  authMiddleware,
  //
  postController.createPost
);

// 글 전체 조회(임시)
router.post('/all', authMiddleware, isMember, postController.showPosts);

// 글 상세 조회
router.get('/:postId', authMiddleware, isMember, postController.showPostDetail);

// 글 수정
router.put('/:postId', authMiddleware, isMember, postController.editPost);

// 글 삭제
router.delete('/:postId', authMiddleware, isMember, postController.deletePost);

// 이미지 단일 업로드 router, 보류로 주석처리.
router.post('/image', upload.single('image'), postController.postImage);

module.exports = router;
