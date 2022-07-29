const boardController = require('../../src/controller/boards');
const request = require('supertest');
const app = require('../../app');
const httpMocks = require('node-mocks-http');
const Board = require('../../src/model/board');
const boardData = require('../data/board.json');
const userEmail = 'test@test.com';
Board.find = jest.fn();
Board.findById = jest.fn();
Board.findByIdAndUpdate = jest.fn();
Board.findByIdAndDelete = jest.fn();

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

//===============공지 글 작성하기======================
describe('test 공지글 작성 API ', () => {
  beforeEach(() => {
    req.body = boardData;
  });
  it('should createBoard 은 함수여야 한다.', () => {
    expect(typeof boardController.createBoard).toBe('function');
  });
  it('should call Board.create을 호출한다.', async () => {
    await boardController.createBoard(req, res, next);
    expect(Board.create);
  });
});

//=============== 공지 글 전체조회, 상세조회 ======================
describe('test 공지조회 API', () => {
  it('should have a showBoards function', () => {
    expect(typeof boardController.showBoards).toBe('function');
  });

  it('should showBoards 는 응답값으로 object 값을 반환한다.', async () => {
    Board.find.mockReturnValue(boardData);
    await boardController.showBoards(req, res, next);
    expect(typeof res._getData()).toBe('object');
  });

  it('should showBoardOne는 함수여야 한다.', () => {
    expect(typeof boardController.showBoardOne).toBe('function');
  });

  it('should 응답값으로 string 값을 반환한다.', async () => {
    Board.find.mockReturnValue(boardData);
    await boardController.showBoardOne(req, res, next);
    console.log('-----', res._getData());
    expect(typeof res._getData()).toBe('string');
  });
});

//===============글 수정 ======================

describe('test 글 수정 API', () => {
  it('should editBoard 타입은 함수여야 한다.', () => {
    expect(typeof boardController.editBoard).toBe('function');
  });
  it('editBoard의 에러 결과값은 string을 반환해야 한다.', async () => {
    req.params.boardId = '1';
    await boardController.editBoard(req, res, next);
    console.log('-----', res._getData());
    expect(typeof res._getData()).toBe('string');
  });
});

//===============글 삭제 ======================

describe('test 글 삭제 API', () => {
  it('should deleteBoard타입은 함수여야 한다.', () => {
    expect(typeof boardController.deleteBoard).toBe('function');
  });
  it('deleteBoard의 에러 결과값은 string을 반환해야 한다.', async () => {
    req.params.boardId = Number(1);
    await boardController.deleteBoard(req, res, next);
    console.log('-----', res._getData());
    expect(typeof res._getData()).toBe('string');
  });
});
