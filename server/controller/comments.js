const Post = require('../schemas/post');
const Comment = require('../schemas/comment');

//code :102 공지 댓글 작성하기
async function commentUpload(req, res) {
  try {
    //#swagger.tags= ['댓글 API'];
    //#swagger.summary= '댓글 등록 API'
    //##swagger.description='-'
    const postId = Number(req.params.postId);
    const { comment } = req.body;
    const { userName } = res.locals.User;

    const maxCommentId = await Comment.findOne({ postId }).sort({
      commentId: -1,
    });

    let commentId = 1;
    if (maxCommentId) {
      commentId = maxCommentId.commentId + 1;
    }

    const targetPost = await Post.findOne({ postId });

    const createdcomment = await Comment.create({
      postId,
      commentId,
      userName,
      content,
      createdTime,
    });
    res.json({ targetPost: createdcomment });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
}
//댓글 삭제하기
async function commentDelete(req, res) {
  try {
    //#swagger.tags= ['댓글 API'];
    //#swagger.summary= '댓글 삭제 API'
    //##swagger.description='-'
    const { postId } = req.para;
    ms;
    const { commentId } = req.params;

    const { UserName } = res.locals.User;
    const existComment = await Comment.find({
      $and: [{ postId }, { commentId }],
    });
    if (existComment.length === 0) {
      return res
        .status(400)
        .json({ errorMessage: '댓글이 존재하지 않습니다.' });
    }

    if (UserName === existComment[0].UserName) {
      await Comment.deleteOne({ commentId });
      res.status(200).json({ result: true });
    } else if (existComment[0].UserName !== UserName) {
      return res
        .status(400)
        .json({ errorMessage: '본인이 쓴 댓글만 수정가능합니다.' });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
}
//댓글 수정하기
async function commentEdit(req, res) {
  //#swagger.tags= ['댓글 API'];
  //#swagger.summary= '댓글 수정 API'
  //##swagger.description='-'
  const { postId } = req.params;
  const { commentId } = req.params;
  const { comment } = req.body;
  const userName = res.locals.User.userName;
  const existComment = await Comment.find({
    $and: [{ postId }, { commentId }],
  });

  if (existComment.length === 0) {
    return res.json({ errorMessage: '댓글이 존재하지 않습니다.' });
  }
  if (existComment[0].UserName !== UserName) {
    return res.json({ errorMessage: '본인이 쓴 댓글만 수정가능합니다.' });
  }

  await Comment.updateOne(
    { $and: [{ postId }, { commentId }] },
    { $set: { comment } }
  );
  res.status(200).json({ successMessage: '정상적으로 수정 완료하였습니다.' });
}

module.exports = {
  commentUpload,
  commentDelete,
  commentEdit,
};