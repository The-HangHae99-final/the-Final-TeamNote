
const express = require("express");
const router = express.Router();
const boardController = require("../controller/boards");
const authMiddleware = require("../middlewares/authMiddleware");
const isMember = require("../middlewares/isMember");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
const fs = require("fs");
const path = require("path");


const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,

  region: "ap-northeast-2",

});

const upload = multer({
  storage: multerS3({
    s3: s3,

    bucket: "kimha",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read-write",

    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now()}_${file.originalname}`);
    },
  }),
});
//글 작성
router.post(

  "/",
  upload.single("img"),
  authMiddleware,
  isMember,
  boardController.createBoard
);

// 글 전체 조회(임시)

router.get("/", authMiddleware, isMember, boardController.showBoards);

// 글 한개 조회

router.get('/:boardId', authMiddleware, isMember, boardController.showBoardOne);

// 글 수정
router.put('/:boardId', authMiddleware, isMember, boardController.editBoard);

router.delete('/:boardId', authMiddleware, boardController.deleteBoard);


module.exports = router;
