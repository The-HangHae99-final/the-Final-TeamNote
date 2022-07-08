const Post = require('../schemas/post');
const Comment = require('../schemas/comment');

//글 작성하기
async function postUpload(req, res, next) {
  try {
    const userName = res.locals.User;
    const { title, content, category } = req.body;

    const maxpostId = await Post.findOne().sort({
      postId: -1,
    });
    // console.log(maxpostId)
    let postId = 1;
    if (maxpostId) {
      postId = maxpostId.postId + 1;
    }

    const createdPost = await Post.create({
      postId,
      userName,
      title,
      content,
      category,
    });
    return res.send({
      result: createdPost,
      ok: true,
      message: '게시물 작성 성공',
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ error, errorMessage: '요청한 데이터 형식이 올바르지 않습니다.' });
  }
}

// 글 전체 조회
async function postAllView(req, res, next) {
  try {
    let posts;
    if (!req.query.category) {
      posts = await Post.find({}).sort('-postId');
    } else {
      const category = req.query.category;
      posts = await Post.find({ category }).sort('-postId');
    }
    return res.json({
      result: {
        count: posts.length,
        rows: posts,
      },
      ok: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ ok: false, message: '게시물 조회 실패' });
  }
}

//글 하나 조회
async function postView(req, res, next) {
  try {
    const postId = Number(req.params.postId);
    const existsPost = await Post.find({ postId });
    if (!existsPost.length) {
      return res
        .status(400)
        .json({ ok: false, errorMessage: '찾는 게시물 없음.' });
    }

    const existsComment = await Comment.find({ postId }).sort({
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
async function postEdit(req, res, next) {
  try {
    const postId = Number(req.params.postId);
    const [existPost] = await Post.find({ postId });
    const { user } = res.locals;
    const { title, category, content } = req.body;
    if (user.userName !== existPost.userName) {
      return res.status(401).json({ ok: false, message: '작성자가 아닙니다.' });
    }
    if (!title || !category || !content) {
      return res.status(400).json({ ok: false, message: '빈값을 채워주세요' });
    }

    await Post.updateOne({ postId }, { $set: { title, category, content } });
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

module.exports = {
  postUpload,
  postAllView,
  postView,
  postEdit,
  postDelete,
};
