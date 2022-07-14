const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const postController = require('../controller/posts');
const authMiddleware = require('../middlewares/auth-middleware');
const isMember = require('../middlewares/isMember');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: 'ap-northeast-2',
});
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'kimha',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read-write',
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now()}_${file.originalname}`);
    },
  }),
});

//글 작성
router.post(
  '/post/:workSpaceName',
  upload.single('img'),
  authMiddleware,
  isMember,
  postController.postUpload
);

// 글 전체 조회(임시)
router.get(
  '/post/:workSpaceName',
  authMiddleware,
  isMember,
  postController.postAllView
);

// 글 한개 조회
router.get(
  '/post/:workSpaceName/:postId',
  authMiddleware,
  isMember,
  postController.postView
);

// 글 수정
router.put(
  '/post/:workSpaceName/:postId',
  authMiddleware,
  isMember,
  postController.postEdit
);

// 글 삭제
router.delete(
  '/post/:workSpaceName/:postId',
  authMiddleware,
  isMember,
  postController.postDelete
);

router.post('/image', upload.single('image'), postController.postImage);

module.exports = router;
