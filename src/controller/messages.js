const Message = require('../schemas/message');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
// s3 for multer
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

// 메시지 수정
// api/message/:_id
async function editMessage(req, res) {
  try {
    //#swagger.tags= ['메세지 API'];
    //#swagger.summary= '메세지 수정 API'
    //#swagger.description='-'
    const { messageId } = req.params._id;
    const [existMessage] = await Message.findById(messageId);
    const { userName } = res.locals.User;
    const { message } = req.body;

    if (userName !== existMessage.author) {
      return res
        .status(401)
        .json({ success: false, message: '작성자가 아닙니다.' });
    }
    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: '빈값을 채워주세요' });
    }

    const editedMessage = await Message.updateOne(
      { _id },
      { $set: { message } }
    );
    return res.status(200).json({
      result: editedMessage,
      success: true,
      message: '메시지 수정 성공',
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: '메시지 수정 에러' });
  }
}
//메시지 삭제
// api/message/:_id
async function deleteMessage(req, res) {
  try {
    //#swagger.tags= ['메세지 API'];
    //#swagger.summary= '메세지 삭제 API'
    //#swagger.description='-'
    const { messageId } = req.params._id;
    const author = res.locals.User.userName;

    const targetMessage = await Message.findById(messageId);

    if (!targetMessage.length) {
      return res.status(400).json({
        success: false,
        message: '해당 메시지가 존재하지 않습니다.',
      });
    } else if (targetMessage[0].author !== author) {
      return res.status(400).json({
        success: false,
        message: '본인만 삭제 가능 합니다.',
      });
    }

    await Message.findByIdAndDelete({ messageId });
    return res.status(200).json({ success: true, message: '메시지 삭제 성공' });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: '메시지 삭제 실패',
    });
  }
}
//메시지 조회
// api/message/:_id
async function showMessage(req, res) {
  try {
    //#swagger.tags= ['메세지 API'];
    //#swagger.summary= '메세지 조회 API'
    //#swagger.description='-'
    const { messageId } = req.params._id;

    const targetMessage = await Message.findById(messageId);

    return res.json({
      targetMessage,
      success: true,
    });
  } catch (err) {
    console.error(err);

    return res
      .status(400)
      .json({ success: false, message: '메시지 조회 실패' });
  }
}

async function postImage(req, res, next) {
  try {
    console.log('경로 정보입니다.', req.file.location);
    console.log('req.body정보', req.body.title);
    res.json({ success: true, message: '이미지 업로드에 성공하였습니다.' });
  } catch (error) {
    res.json({
      success: false,
      message: '이미지 업로드에 예상치 못한 에러로 실패하였습니다.',
      errorMessage: error.message,
    });
  }
}

module.exports = {
  editMessage,
  deleteMessage,
  showMessage,
  postImage,
};
