const Board = require('../schemas/boards');
const boardComment = require('../schemas/boardComment');

//글 작성하기

// code : 101 , 소속 워크스페이스 공지용 , 채팅 X
async function boardUpload(req, res, next) {
  // 글 작성하기

  try {
    //#swagger.tags= ['게시글 API'];
    //#swagger.summary= '게시글 등록 API'
    //##swagger.description='-'
    const { userName } = res.locals.User;
    const { workSpaceName } = req.params;
    const { title, content } = req.body;

    const maxboardId = await Board.findOne().sort({
      boardId: -1,
    });
    // console.log(maxboardId)
    let boardId = 1;
    if (maxboardId) {
      boardId = maxboardId.boardId + 1;
    }
    const createdTime = new Date();
    console.log(createdTime);

    const createdBoard = await Board.create({
      boardId,
      workSpaceName,
      userName,
      title,
      content,
      createdTime,
    });
    return res.json({
      result: createdBoard,
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

// 공지 글 전체 조회
// 김하연이 이 부분 수정
// 워크스페이스 파라미터 값
async function boardAllView(req, res, next) {
  try {
    const { workSpaceName } = req.params;
    const boards = await Board.find({ workSpaceName }).sort('-boardId');
    res.send({ boards, message: '공지 조회에 성공 했습니다.' });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error, errMessage: '공지 조회에 실패 했습니다.' });
  }
}

//글 하나 조회
// 이 부분도 파라미터 값 받아야함
async function boardView(req, res, next) {
  try {
    const boardId = Number(req.params.boardId);
    const existsBoard = await Board.find({ boardId });
    if (!existsBoard.length) {
      return res
        .status(400)
        .json({ ok: false, errorMessage: '찾는 게시물 없음.' });
    }

    const existsComment = await boardComment.find({ boardId }).sort({
      commentId: -1,
    });
    res.json({ existsBoard, existsComment });
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
async function boardEdit(req, res, next) {
  try {
    const boardId = Number(req.params.boardId);
    const [existBoard] = await Board.find({ boardId });
    const { user } = res.locals;
    const { title, content } = req.body;
    if (user.userName !== existBoard.userName) {
      return res.status(401).json({ ok: false, message: '작성자가 아닙니다.' });
    }
    if (!title || !content) {
      return res.status(400).json({ ok: false, message: '빈값을 채워주세요' });
    }

    await Board.updateOne({ boardId }, { $set: { title, content } });
    return res.status(200).json({
      result: await Board.findOne({ boardId }),
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
async function boardDelete(req, res, next) {
  try {
    const boardId = Number(req.params.boardId);
    console.log('boardId: ', boardId);
    const [targetBoard] = await Board.find({ boardId });
    const { userName } = res.locals.User;

    if (userName !== targetBoard.userName) {
      return res.status(401).json({
        ok: false,
        message: '작성자가 아닙니다.',
      });
    }
    await Board.deleteOne({ boardId });
    return res.json({ ok: true, message: '게시글 삭제 성공' });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: '게시글 삭제 실패',
    });
  }
}

module.exports = {
  boardUpload,
  boardAllView,
  boardView,
  boardEdit,
  boardDelete,
};
