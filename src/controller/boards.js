const Board = require("../models/board");
const boardComment = require("../models/boardComment");

//공지 글 작성하기
// /board/:workSpaceName
// 소속 워크스페이스 공지용
// router.post(
//   '/boards',
//   upload.single('img'),
//   authMiddleware,
//   isMember,
//   boardController.boardUpload
// );
async function createBoard(req, res, next) {
  try {
    //#swagger.tags= ['공지글 API'];
    //#swagger.summary= '공지글 등록 API'
    //##swagger.description='-'
    // const image = req.file.location;
    const { userName } = res.locals.User;
    const { content, workSpaceName } = req.body;
    const createdTime = new Date();

    const maxboardId = await Board.findOne().sort({
      boardId: -1,
    });

    let boardId = 1;
    
    if (maxboardId) {
      boardId = maxboardId.boardId + 1;
    }
    console.log('boardId: ', boardId);
    if (!userName || !content || !workSpaceName) 
    {
      res.status(400).send({
        success: false,
        errorMessage: "필요한 항목을 전부 입력해주세요.",
      });
    }
    // if (!image) {
    //   res
    //     .status(400)
    //     .send({ success: false, errorMessage: '이미지가 없습니다.' });
    // }
    else{
      const createdBoard = await Board.create({
      // image,
      boardId,
      workSpaceName,
      userName,
      content,
      createdTime,
    });
    return res.status(201).json({
      result: createdBoard,
      success: true,
      message: "게시물 작성 성공",
    });}
    
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "요청한 데이터 형식이 올바르지 않습니다.",
      errorMessage: error.message,
    });
  }
}

// 공지 글 전체 조회
// 워크스페이스 파라미터 값
// router.get('/boards', authMiddleware, isMember, boardController.boardAllView);
async function showBoards(req, res, next) {
  try {
    //#swagger.tags= ['공지글 API'];
    //#swagger.summary= '공지글 전체 조회 API'
    //##swagger.description='-'
    const { workSpaceName } = req.params;
    const boards = await Board.find({ workSpaceName }).sort("-boardId");

    if (!workSpaceName) {
      res
        .status(400)
        .send({ success: false, message: "워크 스페이스 네임이 없습니다." });
    }

    res.send({ boards, message: "공지 조회에 성공 했습니다." });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      Message: "공지 조회에 실패 했습니다.",
      errorMessage: error.message,
    });
  }
}

//글 한개 조회
// /board/:workSpaceName/:boardId
// router.get(
//   '/boards/:boardId',
//   authMiddleware,
//   isMember,
//   boardController.boardView
// );
async function showBoardOne(req, res, next) {
  try {
    //#swagger.tags= ['공지글 API'];
    //#swagger.summary= '공지글 한개 조회 API'
    //##swagger.description='-'
    const boardId = Number(req.params.boardId);
    const existsBoard = await Board.find({ boardId });
    if (!existsBoard.length) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "찾는 게시물이 없습니다." });
    }
    if (!boardId) {
      res
        .status(400)
        .send({ success: false, message: "공지 아이디가 없습니다." });
    }

    const existsComment = await boardComment.find({ boardId }).sort({
      commentId: -1,
    });
    res.json({ existsBoard, existsComment });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      success: false,
      Message: "요청한 데이터 형식이 올바르지 않습니다.",
      errorMessage: err.message,
    });
  }
}

// 글 수정
// router.put(
//   '/boards/:boardId',
//   authMiddleware,
//   isMember,
//   boardController.boardEdit
// );
async function editBoard(req, res, next) {
  try {
    //#swagger.tags= ['공지글 API'];
    //#swagger.summary= '공지글 수정 API'
    //##swagger.description='-'
    const boardId = Number(req.params.boardId);
    const [existBoard] = await Board.find({ boardId });
    const { user } = res.locals;
    const { content } = req.body;

    if (!boardId) {
      res
        .status(400)
        .send({ success: false, message: "공지 아이디가 없습니다." });
    }

    if (!user) {
    }
    res.status(400).send({ success: false, message: "유저 정보가 없습니다." });

    if (user.userName !== existBoard.userName) {
      return res
        .status(401)
        .json({ success: false, message: "작성자가 아닙니다." });
    }
    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "빈값을 채워주세요" });
    }

    await Board.updateOne({ boardId }, { $set: { content } });
    return res.status(200).json({
      result: await Board.findOne({ boardId }),
      success: true,
      message: "게시글 수정 성공",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "게시글 수정 에러",
      errorMessage: err.message,
    });
  }
}

// 글 삭제
// router.delete('/board/:boardId', authMiddleware, boardController.boardDelete);
async function deleteBoard(req, res, next) {
  try {
    //#swagger.tags= ['공지글 API'];
    //#swagger.summary= '공지글 삭제 API'
    //##swagger.description='-'
    const boardId = Number(req.params.boardId);
    const [targetBoard] = await Board.find({ boardId });
    const { userName } = res.locals.User;

    if (!boardId) {
      res
        .status(400)
        .send({ success: false, message: "공지 아이디가 없습니다." });
    }

    if (!userName) {
    }
    res.status(400).send({ success: false, message: "유저 이름이 없습니다." });

    if (userName !== targetBoard.userName) {
      return res.status(401).json({
        success: false,
        message: "작성자가 아닙니다.",
      });
    }
    await Board.deleteOne({ boardId });
    return res.json({ success: true, message: "게시글 삭제 성공" });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "게시글 삭제 실패",
      errorMessage: error.message,
    });
  }
}

module.exports = {
  createBoard,
  showBoards,
  showBoardOne,
  editBoard,
  deleteBoard,
};
