const Post = require('../models/post');
const postComment = require('../models/postComment');

//포스트 댓글 작성
//  api/post/:postId
async function createPostComment(req, res) {
  try {
    //#swagger.tags= ['게시글 댓글 API'];
    //#swagger.summary= '게시글 댓글 작성 API'
    //##swagger.description='-'
    const postId = Number(req.params.postId);
    const { content } = req.body;
    const { userName } = res.locals.User;
    const createdTime = new Date();

    const maxCommentId = await postComment.findOne({ postId }).sort({
      commentId: -1,
    });

    let commentId = 1;
    if (maxCommentId) {
      commentId = maxCommentId.commentId + 1;
    }

    const targetPost = await Post.findOne({ postId });

    const createdcomment = await postComment.create({
      postId,
      commentId,
      userName,
      content,
      createdTime,
    });
    res.json({ targetPost: createdcomment });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
}

//포스트 댓글 수정하기
//  api/post/:postId/:commentId
async function editPostComment(req, res) {
  //#swagger.tags= ['게시글 댓글 API'];
  //#swagger.summary= '게시글 댓글 수정 API'
  //##swagger.description='-'
  const { postId } = req.params;
  const { commentId } = req.params;
  const { content } = req.body;
  const userName = res.locals.User.userName;
  const existComment = await postComment.find({
    $and: [{ postId }, { commentId }],
  });

  if (existComment.length === 0) {
    return res.json({ errorMessage: '댓글이 존재하지 않습니다.' });
  }
  if (existComment[0].UserName !== userName) {
    return res.json({ errorMessage: '본인이 쓴 댓글만 수정가능합니다.' });
  }

  await postComment.updateOne(
    { $and: [{ postId }, { commentId }] },
    { $set: { content } }
  );
  res.status(200).json({ successMessage: '정상적으로 수정 완료하였습니다.' });
}

//포스트 댓글 삭제하기
//  api/post/:postId/:commentId
async function deletePostComment(req, res) {
  try {
    //#swagger.tags= ['게시글 댓글 API'];
    //#swagger.summary= '게시글 댓글 삭제 API'
    //##swagger.description='-'
    const { postId } = req.params;
    const { commentId } = req.params;

    const { UserName } = res.locals.User;
    const existComment = await postComment.find({
      $and: [{ postId }, { commentId }],
    });
    if (existComment.length === 0) {
      return res
        .status(400)
        .json({ errorMessage: '댓글이 존재하지 않습니다.' });
    }

    if (UserName === existComment[0].UserName) {
      await postComment.deleteOne({ commentId });
      res.status(200).json({ result: true });
    } else if (existComment[0].UserName !== UserName) {
      return res
        .status(400)
        .json({ errorMessage: '본인이 쓴 댓글만 수정가능합니다.' });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
}

module.exports = {
  createPostComment,
  deletePostComment,
  editPostComment,
};
