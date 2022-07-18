const Board = require('../schemas/boards');
const boardComment = require('../schemas/boardComment');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

//공지 글 작성하기
// /board/:workSpaceName
// 소속 워크스페이스 공지용
async function boardUpload(req, res, next) {
  try {
    //#swagger.tags= ['공지글 API'];
    //#swagger.summary= '공지글 등록 API'
    //##swagger.description='-'
    const image = req.file.location;
    const { userName } = res.locals.User;

    const { title, content, workSpaceName } = req.body;

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
      image,
      boardId,
      workSpaceName,
      userName,
      title,
      content,
      createdTime,
    });
    return res.json({
      result: createdBoard,
      success: true,
      message: '게시물 작성 성공',
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      Message: '요청한 데이터 형식이 올바르지 않습니다.',
      errorMessage: error.message,
    });
  }
}

// 공지 글 전체 조회
// 워크스페이스 파라미터 값
// /board/:workSpaceName
async function boardAllView(req, res, next) {
  try {
    //#swagger.tags= ['공지글 API'];
    //#swagger.summary= '공지글 전체 조회 API'
    //##swagger.description='-'
    const { workSpaceName } = req.body;
    const boards = await Board.find({ workSpaceName }).sort('-boardId');
    res.send({ boards, message: '공지 조회에 성공 했습니다.' });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      Message: '공지 조회에 실패 했습니다.',
      errorMessage: error.message,
    });
  }
}

//글 하나 조회
// /board/:workSpaceName/:boardId
async function boardView(req, res, next) {
  try {
    //#swagger.tags= ['공지글 API'];
    //#swagger.summary= '공지글 한개 조회 API'
    //##swagger.description='-'
    const boardId = Number(req.params.boardId);
    const existsBoard = await Board.find({ boardId });
    if (!existsBoard.length) {
      return res
        .status(400)
        .json({ success: false, errorMessage: '찾는 게시물 없음.' });
    }

    const existsComment = await boardComment.find({ boardId }).sort({
      commentId: -1,
    });
    res.json({ existsBoard, existsComment });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      Message: '요청한 데이터 형식이 올바르지 않습니다.',
      errorMessage: err.message,
    });
  }
}

// 글 수정
// /board/:workSpaceName/:boardId
async function boardEdit(req, res, next) {
  try {
    //#swagger.tags= ['공지글 API'];
    //#swagger.summary= '공지글 수정 API'
    //##swagger.description='-'
    const boardId = Number(req.params.boardId);
    const [existBoard] = await Board.find({ boardId });
    const { user } = res.locals;
    const { title, content } = req.body;
    if (user.userName !== existBoard.userName) {
      return res
        .status(401)
        .json({ success: false, message: '작성자가 아닙니다.' });
    }
    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, message: '빈값을 채워주세요' });
    }

    await Board.updateOne({ boardId }, { $set: { title, content } });
    return res.status(200).json({
      result: await Board.findOne({ boardId }),
      success: true,
      message: '게시글 수정 성공',
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: '게시글 수정 에러',
      errorMessage: err.message,
    });
  }
}

// 글 삭제
// /board/:workSpaceName/:boardId
async function boardDelete(req, res, next) {
  try {
    //#swagger.tags= ['공지글 API'];
    //#swagger.summary= '공지글 삭제 API'
    //##swagger.description='-'
    const boardId = Number(req.params.boardId);
    console.log('boardId: ', boardId);
    const [targetBoard] = await Board.find({ boardId });
    const { userName } = res.locals.User;

    if (userName !== targetBoard.userName) {
      return res.status(401).json({
        success: false,
        message: '작성자가 아닙니다.',
      });
    }
    await Board.deleteOne({ boardId });
    return res.json({ ok: true, message: '게시글 삭제 성공' });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: '게시글 삭제 실패',
      errorMessage: error.message,
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
