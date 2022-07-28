const workSpaceController = require('../src/controller/workSpaces');
const workSpace = require('../src/schemas/workSpace');
const httpMocks = require('node-mocks-http');
const newWorkSpace = require('./data/workSpace.json');
const workSpaceList = require('./data/workSpaceList.json');
const locals = require('./data/locals.json');

workSpace.create = jest.fn();
workSpace.find = jest.fn();
workSpace.findOne = jest.fn();
workSpace.deleteOne = jest.fn();

const workSpaceName = 'email@email.com+workSpaceName';

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
  res.locals.user = locals;
});
describe('workSpace Controller Create', () => {
  beforeEach(() => {
    req.body = newWorkSpace.name;
    result = {
      name: `${userEmail}+${req.body}`,
      owner: newWorkSpace.owner,
    };
  });
  it('should have a create function', () => {
    expect(typeof workSpaceController.create).toBe('function');
  });
  it('should call workSpace.create', async () => {
    await workSpaceController.create(req, res, next);
    expect(workSpace.create).toBeCalledWith(result);
  });
  it('should return 200 response code', async () => {
    await workSpaceController.create(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });
  it('should return json body in res', async () => {
    workSpace.create.mockReturnValue(newWorkSpace);
    await workSpaceController.create(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newWorkSpace);
  });
  // it("should handle erros", async () => {
  //   const errorMessage = { message: "요청한 데이터 형식이 올바르지 않습니다." };
  //   const rejectedPromise = Promise.reject(errorMessage);
  //   workSpace.create.mockReturnValue(rejectedPromise);
  //   await workSpaceController.createProduct(req, res);
  //   expect(res.statusCode).toBe(400);
  //   expect(res).toBeCalledWith(errorMessage);
  // });
});

describe('워크스페이스 전체조회', () => {
  it('should have a getworkSpaces function', () => {
    expect(typeof workSpaceController.showWorkSpaces).toBe('function');
  });
  it('should call workSpace.find({})', async () => {
    await workSpaceController.showWorkSpaces(req, res, next);
    expect(workSpace.find).toHaveBeenCalledWith({});
  });
  it('should return 200 response', async () => {
    await workSpaceController.showWorkSpaces(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });
  it('should return json body in response', async () => {
    workSpace.find.mockReturnValue(workSpaceList);
    await workSpaceController.showWorkSpaces(req, res, next);
    expect(res._getJSONData()).toStrictEqual(workSpaceList);
  });
});

describe('워크스페이스 검색', () => {
  beforeEach(() => {
    req.body = newWorkSpace.name;
  });
  it('should have a searchWorkSpace function', () => {
    expect(typeof workSpaceController.searchWorkSpace).toBe('function');
  });
  it('should call workSpace.findOne', async () => {
    await workSpaceController.searchWorkSpace(req, res, next);
    expect(workSpace.findOne).toHaveBeenCalledWith({ name: newWorkSpace.name });
  });
  it('검색 이후 next로 넘긴다.', async () => {
    workSpace.findOne.mockReturnValue(newWorkSpace);
    await workSpaceController.searchWorkSpace(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });
  it('should return json body in response', async () => {
    workSpace.find.mockReturnValue(newWorkSpace);
    await workSpaceController.searchWorkSpace(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newWorkSpace);
  });
});
