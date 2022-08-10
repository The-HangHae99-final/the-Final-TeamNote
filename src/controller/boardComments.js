const Board = require('../models/board');
const boardComment = require('../models/boardComment');

//code :102 공지 댓글 작성하기
//  api/board/:boardId
async function createBoardComment(req, res) {
  try {
    //#swagger.tags= ['공지 댓글 API'];
    //#swagger.summary= '공지 댓글 작성 API'
    //##swagger.description='-'
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
    res.status(400).json({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
}
//댓글 삭제하기
//  api/board/:boardId/:commentId
async function deleteBoardComment(req, res) {
  try {
    //#swagger.tags= ['공지 댓글 API'];
    //#swagger.summary= '공지 댓글 삭제 API'
    //##swagger.description='-'
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
    res.status(400).json({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
}
//댓글 수정하기
//  api/board/:boardId/:commentId
async function editBoardComment(req, res) {
  //#swagger.tags= ['공지 댓글 API'];
  //#swagger.summary= '공지 댓글 수정 API'
  //##swagger.description='-'
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

module.exports = {
  createBoardComment,
  deleteBoardComment,
  editBoardComment,
};
