const Post = require('../schemas/post');
const postComment = require('../schemas/postComment');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// const s3 = new AWS.S3({
//   accessKeyId: process.env.accessKeyId,
//   secretAccessKey: process.env.secretAccessKey,
//   region: 'ap-northeast-2',
// });

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'kimha',
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     acl: 'public-read-write',
//     key: function (req, file, cb) {
//       cb(null, `uploads/${Date.now()}_${file.originalname}`);
//     },
//   }),
// });

// code : 101 , 소속 워크스페이스 공지용 , 채팅 X
// async function postUpload(req, res, next) {
//   // 글 작성하기
//   //#swagger.tags= ['일반 게시글 API'];
//   //#swagger.summary= '게시글 글 작성 API'
//   //#swagger.description='-'
//   try {
//     const { userName } = res.locals.User;
//     const { workSpaceName } = req.params;

//     const { title, content } = req.body;
//     const createdTime = new Date();
//     console.log(createdTime);
//     const maxpostId = await Post.findOne().sort({
//       postId: -1,
//     });
//     // console.log(maxpostId)
//     let postId = 1;
//     if (maxpostId) {
//       postId = maxpostId.postId + 1;
//     }

//     const createdPost = await Post.create({
//       postId,
//       workSpaceName,
//       userName,
//       title,
//       content,
//       createdTime,
//     });
//     return res.json({
//       result: createdPost,
//       ok: true,
//       message: '게시물 작성 성공',
//     });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(400)
//       .send({ error, errorMessage: '요청한 데이터 형식이 올바르지 않습니다.' });
//   }
// }

// 일반 글 전체 조회

async function postAllView(req, res, next) {
  try {
    //#swagger.tags= ['일반 게시글 API'];
    //#swagger.summary= '게시글 글 전체 조회 API'
    //##swagger.description='-'
    const { workSpaceName } = req.body;
    const posts = await Post.find({ workSpaceName }).sort('-postId');
    res.send({ posts, message: '공지 조회에 성공 했습니다.' });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error, errMessage: '공지 조회에 실패 했습니다.' });
  }
}

//글 하나 조회
// 이 부분도 파라미터 값 받아야함
async function postView(req, res, next) {
  try {
    // 글 작성하기
    //#swagger.tags= ['일반 게시글 API'];
    //#swagger.summary= '일반게시글 특정 글 조회 API'
    //#swagger.description='-'
    const postId = Number(req.params.postId);
    const existsPost = await Post.find({ postId });
    if (!existsPost.length) {
      return res
        .status(400)
        .json({ ok: false, errorMessage: '찾는 게시물 없음.' });
    }

    const existsComment = await postComment.find({ postId }).sort({
      commentId: -1,
    });
    res.json({ existsPost, existsComment });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
}

// 글 수정
// 수정시간 넣기
// 카테고리 빼기
async function postEdit(req, res, next) {
  try {
    //#swagger.tags= ['일반 게시글 API'];
    //#swagger.summary= '일반 게시글 글 수정 API'
    //#swagger.description='-'
    const postId = Number(req.params.postId);
    const [existPost] = await Post.find({ postId });
    const { user } = res.locals.User;
    const { title, content } = req.body;
    if (user.userName !== existPost.userName) {
      return res.status(401).json({ ok: false, message: '작성자가 아닙니다.' });
    }
    if (!title || !content) {
      return res.status(400).json({ ok: false, message: '빈값을 채워주세요' });
    }

    await Post.updateOne({ postId }, { $set: { title, content } });
    return res.status(200).json({
      result: await Post.findOne({ postId }),
      ok: true,
      message: '게시글 수정 성공',
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: '게시글 수정 에러' });
  }
}

// 글 삭제
async function postDelete(req, res, next) {
  try {
    //#swagger.tags= ['일반 게시글 API'];
    //#swagger.summary= '일반 게시글 삭제 API'
    //#swagger.description='-'
    const postId = Number(req.params.postId);
    console.log('postId: ', postId);
    const [targetPost] = await Post.find({ postId });
    const { userName } = res.locals.User;

    if (userName !== targetPost.userName) {
      return res.status(401).json({
        ok: false,
        message: '작성자가 아닙니다.',
      });
    }
    await Post.deleteOne({ postId });
    return res.json({ ok: true, message: '게시글 삭제 성공' });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: '게시글 삭제 실패',
    });
  }
}

async function postImage(req, res, next) {
  try {
    console.log('경로 정보입니다.', req.file.location);
    console.log('req.body정보', req.body.title);
    res.json('hi');
  } catch (error) {
    res.json('bye');
  }
}

// router.post('/post', upload.single('image'), async (req, res) => {
async function postUpload(req, res, next) {
  try {
    //#swagger.tags= ['일반 게시글 API'];
    //#swagger.summary= '일반 게시글 등록 API'
    //#swagger.description='-'
    // const image = req.file.location;
    console.log('--------------------------------' + image);
    const { userName } = res.locals.User;
    const { title, content, workSpaceName, category } = req.body;
    const createdTime = new Date();
    console.log(createdTime);
    const maxpostId = await Post.findOne().sort({
      postId: -1,
    });
    // console.log(maxpostId)
    let postId = 1;
    if (maxpostId) {
      postId = maxpostId.postId + 1;
    }

    const createdPost = await Post.create({
      // image,
      postId,
      workSpaceName,
      userName,
      title,
      content,
      category,
      createdTime,
    });
    return res.json({
      result: createdPost,
      ok: true,
      message: '게시물 작성 성공',
    });
    res.json({ result: true });
  } catch (error) {
    res.send({ errorMessage: error.message, success: false });
  }
}

module.exports = {
  postUpload,
  postAllView,
  postView,
  postEdit,
  postDelete,
  postImage,
};
