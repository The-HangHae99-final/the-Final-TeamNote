const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const messageController = require('../controller/messages');
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

//메시지 수정
router.put('/:_id', authMiddleware, isMember, messageController.editMessage);

//메시지 삭제
router.delete('/:_id', authMiddleware, messageController.deleteMessage);

//메시지 조회
router.get('/:_id', authMiddleware, isMember, messageController.showMessage);

// 단일 이미지 업로드
router.post('/image', upload.single('image'), messageController.postImage);

// //룸 이름 얻기
// router.get('/roomId/:workSpaceName/:opponent', authMiddleware, isMember, messageController.getRoomId);

module.exports = router;
