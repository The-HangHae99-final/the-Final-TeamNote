const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const postController = require('../controller/posts');
const { s3 } = require('../controller/util/aws-s3');
const { upload } = require('../controller/util/aws-s3');
const isMember = require('../middlewares/isMember');

//일반 게시글
//글 작성
router.post('/', postController.createPost);
// 글 전체 조회
router.get('/list/:workSpaceName', postController.showPosts);

// 글 상세 조회
router.get('/:workSpaceName/:postId', postController.showPostDetail);

// 글 수정
router.put('/:postId', isMember, postController.editPost);

// 글 삭제
router.delete('/:postId', isMember, postController.deletePost);

// 이미지 단일 업로드 router, 보류로 주석처리.
router.post('/image', upload.single('image'), postController.postImage);

router.post('/file', upload.single('file'), postController.postFile);

module.exports = router;
