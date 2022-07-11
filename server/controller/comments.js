const Post = require('../schemas/post');
const Board = require('../schemas/boards');
const postComment = require('../schemas/postComment');
const boardComment = require('../schemas/boardComment');

//code :102 공지 댓글 작성하기
async function boardCommentUpload(req, res) {
  try {
    const boardId = Number(req.params.boardId);
    const { content } = req.body;
    const { userName } = res.locals.User;
    const createdTime = new Date();

    const maxCommentId = await boardComment.findOne({ boardId }).sort({
      commentId: -1,
    });

    let commentId = 1;
    if (maxCommentId) {
      commentId = maxCommentId.commentId + 1;
    }

    const targetBoard = await Board.findOne({ boardId });

    const createdComment = await boardComment.create({
      boardId,
      commentId,
      userName,
      content,
      createdTime,
    });
    res.json({ targetBoard: createdComment });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
}
//댓글 삭제하기
async function boardCommentDelete(req, res) {
  try {
    const { boardId } = req.params;
    const { commentId } = req.params;

    const { UserName } = res.locals.User;
    const existComment = await boardComment.find({
      $and: [{ boardId }, { commentId }],
    });
    if (existComment.length === 0) {
      return res
        .status(400)
        .json({ errorMessage: '댓글이 존재하지 않습니다.' });
    }

    if (UserName === existComment[0].UserName) {
      await boardComment.deleteOne({ commentId });
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
async function boardCommentEdit(req, res) {
  const { boardId } = req.params;
  const { commentId } = req.params;
  const { content } = req.body;
  const userName = res.locals.User.userName;
  const existComment = await boardComment.find({
    $and: [{ boardId }, { commentId }],
  });

  if (existComment.length === 0) {
    return res.json({ errorMessage: '댓글이 존재하지 않습니다.' });
  }
  if (existComment[0].UserName !== userName) {
    return res.json({ errorMessage: '본인이 쓴 댓글만 수정가능합니다.' });
  }

  await boardComment.updateOne(
    { $and: [{ boardId }, { commentId }] },
    { $set: { content } }
  );
  res.status(200).json({ successMessage: '정상적으로 수정 완료하였습니다.' });
}

//포스트 댓글 작성
async function postCommentUpload(req, res) {
  try {
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
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
}

//포스트 댓글 수정하기
async function postCommentEdit(req, res) {
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
async function postCommentDelete(req, res) {
  try {
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
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
}

module.exports = {
  boardCommentUpload,
  boardCommentDelete,
  boardCommentEdit,
  postCommentUpload,
  postCommentDelete,
  postCommentEdit,
};
