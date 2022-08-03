const Post = require('../models/post');
const postComment = require('../models/postComment');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// 글 작성 API
// router.post('/posts', upload.single('image')
async function createPost(req, res, next) {
  try {
    //#swagger.tags= ['일반 게시글 API'];
    //#swagger.summary= '일반 게시글 등록 API'
    //#swagger.description='-'
    // const image = req.file.location;

    const { userName } = res.locals.User;
    const { title, desc, label, assignees, workSpaceName, category } = req.body;
    const createdTime = new Date();
    console.log(createdTime);

    console.log('maxpost------', maxpostId);
    console.log('maxpostId.postId-------', maxpostId.postId);
    let postId = 1;

    const maxpostId = await Post.findOne().sort({
      postId: -1,
    });

    if (maxpostId.postId) {
      postId = Number(maxpostId.postId) + 1;
    } else {
      postId = 1;
    }
    const createdPost = await Post.create({
      // image, 우선 주석처리
      postId,
      workSpaceName,
      userName,
      title,
      createdTime,
      desc,
      label,
      assignees,
      category,
    });
    return res.json({
      result: createdPost,
      success: true,
      message: '게시물 작성 성공',
    });
  } catch (error) {
    res.send({
      success: false,
      errorMessage: error.message,
      message: '게시물 작성에 예상치 못한 에러가 발생했습니다.',
    });
  }
}

// 일반 글 전체 조회
// router.post('/posts', authMiddleware, isMember, postController.postAllView);
async function showPosts(req, res, next) {
  try {
    //#swagger.tags= ['일반 게시글 API'];
    //#swagger.summary= '게시글 글 전체 조회 API'
    //##swagger.description='-'
    const { workSpaceName } = decodeURIComponent(req.params);

    const posts = await Post.find({ workSpaceName }).sort('-postId');
    res.status(200).send({ posts, message: '게시물 조회에 성공 했습니다.' });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: '게시물 조회에 예상치 못한 에러가 발생 했습니다.',
      errorMessage: error.message,
    });
  }
}

// 글 상세 조회 API
// 파라미터 값 받아야함
// router.get('/posts/:postId', authMiddleware, isMember, postController.postView);
async function showPostDetail(req, res, next) {
  try {
    //#swagger.tags= ['일반 게시글 API'];
    //#swagger.summary= '일반게시글 특정 글 조회 API'
    //#swagger.description='-'
    const postId = Number(req.params.postId);
    const { workSpaceName } = req.body;
    const existsPost = await Post.find({ postId });

    if (!postId) {
      return res.status(400).json({
        success: false,
        errorMessage: '포스트 아이디 값이 입력되지 않았습니다.',
      });
    }

    if (!existsPost.length) {
      return res
        .status(400)
        .json({ success: false, errorMessage: '찾는 게시물이 없습니다.' });
    }

    const existsComment = await postComment.find({ postId }).sort({
      commentId: -1,
    });
    res.json({ success: true, existsPost, existsComment });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: '예상치 못한 에러가 발생했습니다.',
      errorMessage: error.message,
    });
  }
}

// 글 수정
// router.put('/posts/:postId', authMiddleware, isMember, postController.postEdit);
async function editPost(req, res, next) {
  try {
    //#swagger.tags= ['일반 게시글 API'];
    //#swagger.summary= '일반 게시글 글 수정 API'
    //#swagger.description='-'
    const postId = Number(req.params.postId);
    const [existPost] = await Post.find({ postId });
    const { user } = res.locals.User;
    const { title, desc, label, assignees, category } = req.body;
    if (user.userName !== existPost.userName) {
      return res
        .status(401)
        .json({ success: false, message: '해당 글의 작성자가 아닙니다.' });
    }
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'title 혹은 content 값을 채워주세요',
      });
    }

    await Post.updateOne(
      { postId },
      { $set: { title, desc, label, assignees, category } }
    );
    return res.status(200).json({
      result: await Post.findOne({ postId }),
      success: true,
      message: '게시글 수정 성공하였습니다.',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: '게시글 수정에 에러가 발생했습니다.',
      errorMessage: error.message,
    });
  }
}

// 글 삭제 API
// router.delete(
//   '/post/:postId',
//   authMiddleware,
//   isMember,
//   postController.postDelete
// );
async function deletePost(req, res, next) {
  try {
    //#swagger.tags= ['일반 게시글 API'];
    //#swagger.summary= '일반 게시글 삭제 API'
    //#swagger.description='-'
    const postId = Number(req.params.postId);
    console.log('postId: ', postId);
    const [targetPost] = await Post.find({ postId });
    const { userName } = res.locals.User;

    if (!postId) {
      return res.status(400).json({
        success: false,
        errorMessage: '포스트 아이디 값이 입력되지 않았습니다.',
      });
    }

    if (!userName) {
      return res.status(400).json({
        success: false,
        errorMessage: '유저의 이름이 입력되지 않았습니다.',
      });
    }

    if (userName !== targetPost.userName) {
      return res.status(401).json({
        success: false,
        message: '작성자가 아닙니다.',
      });
    }

    if (!targetPost.length) {
      return res.status(401).json({
        success: false,
        message: '해당 게시물이 없습니다.',
      });
    }

    await Post.deleteOne({ postId });
    return res.json({
      success: true,
      message: '게시글 작성을 성공하였습니다.',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: '게시글 삭제가 실패 하였습니다.',
      errorMessage: error.message,
    });
  }
}
// image 단일 업로드 API
async function postImage(req, res, next) {
  try {
    //#swagger.tags= ['일반 게시글 API'];
    //#swagger.summary= '일반 게시글 단일 이미지 업로드 API'
    //#swagger.description='-'
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
  createPost,
  showPosts,
  showPostDetail,
  editPost,
  deletePost,
  postImage,
};
