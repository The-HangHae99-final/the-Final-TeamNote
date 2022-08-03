const workSpaceController = require("../../src/controller/workSpaces");
const workSpace = require("../../src/models/workSpace");
const member = require("../../src/models/member");
const httpMocks = require("node-mocks-http");
const newWorkSpace = require("../data/workSpace.json");
const workSpaceList = require("../data/workSpaceList.json");
const localsUser = require("../data/locals.user.json");
const localsWorkSpace = require("../data/locals.workSpace.json");

workSpace.create = jest.fn();
workSpace.find = jest.fn();
workSpace.findOne = jest.fn();
workSpace.findOneAndDelete = jest.fn();
member.create = jest.fn();
member.deleteMany = jest.fn();

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
  res.locals.User = localsUser;
  res.locals.existWorkSpace = localsWorkSpace;
  req.body = { workSpaceName: newWorkSpace.name };
});
describe("워크스페이스 생성", () => {
  beforeEach(() => {
    res.locals.User = localsUser;
    res.locals.existWorkSpace = localsWorkSpace;
  });
  it("createWorkSpace는 함수이다.", () => {
    expect(typeof workSpaceController.createWorkSpace).toBe("function");
  });

  it("workSpace.create와 member.create는 다음과 같은 내용을 호출해야한다.", async () => {
    const { workSpaceName } = { workSpaceName: newWorkSpace.name };
    await workSpaceController.createWorkSpace(req, res, next);
    expect(workSpace.create).toBeCalledWith({
      owner: localsUser.userEmail,
      name: workSpaceName,
    });
    expect(member.create).toBeCalledWith({
      memberEmail: localsUser.userEmail,
      memberName: localsUser.userName,
      workSpace: workSpaceName,
    });
  });
  it("201 응답코드를 반환한다.", async () => {
    await workSpaceController.createWorkSpace(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled).toBeTruthy();
  });
  it("다음과 같은 json 응답값을 받아야 한다.", async () => {
    const createdWorkSpace = newWorkSpace;
    const addedOwner = {
      memberEmail: localsUser.userEmail,
      memberName: localsUser.memberName,
      workSpace: newWorkSpace.name,
    };
    workSpace.create.mockReturnValue(createdWorkSpace, addedOwner);
    await workSpaceController.createWorkSpace(req, res, next);
    expect(res._getJSONData()).toStrictEqual({createdWorkSpace}, {addedOwner});
  });
});

describe("워크스페이스 전체조회", () => {
  it("showWorkSpaces는 함수이다.", () => {
    expect(typeof workSpaceController.showWorkSpaces).toBe("function");
  });
  it("workSpace.find({})로 워크스페이스를 전체 조회한다.", async () => {
    await workSpaceController.showWorkSpaces(req, res, next);
    expect(workSpace.find).toHaveBeenCalledWith({});
  });
  it("200 응답코드을 반환한다.", async () => {
    await workSpaceController.showWorkSpaces(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });
  it("다음과 같은 json 응답값을 받아야 한다.", async () => {
    workSpace.find.mockReturnValue(workSpaceList);
    await workSpaceController.showWorkSpaces(req, res, next);
    expect(res._getJSONData()).toStrictEqual(workSpaceList);
  });
});

describe("워크스페이스 검색", () => {
  it("searchWorkSpace는 함수이다.", () => {
    expect(typeof workSpaceController.searchWorkSpace).toBe("function");
  });
  it("workSpace.findOne은 다음 내용을 호출한다.", async () => {
    await workSpaceController.searchWorkSpace(req, res, next);
    expect(workSpace.findOne).toHaveBeenCalledWith({ name: undefined });
  });
  it("검색 결과가 없어도 next 처리.", async () => {
    workSpace.findOne.mockReturnValue(null);
    await workSpaceController.searchWorkSpace(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });
  it("워크스페이스 검색 에러 발생시 처리.", async () => {
    const errorMessage = {
      success: false,
      message: "워크스페이스 검색 에러",
    };
    const rejectedPromise = Promise.reject(errorMessage);
    workSpace.findOne.mockReturnValue(rejectedPromise);
    await workSpaceController.searchWorkSpace(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

describe("워크스페이스 삭제", () => {
  it("deleteWorkSpace 는 함수이다.", () => {
    expect(typeof workSpaceController.deleteWorkSpace).toBe("function");
  });
  it("workSpace.findOneAndDelete , member.deleteMany는 다음을 호출한다. ", async () => {
    const { workSpaceName } = { workSpaceName: newWorkSpace.name };
    await workSpaceController.deleteWorkSpace(req, res, next);
    expect(workSpace.findOneAndDelete).toHaveBeenCalledWith({
      name: workSpaceName,
    });
    expect(member.deleteMany).toHaveBeenCalledWith({
      workSpace: workSpaceName,
    });
  });
  it("워크스페이스 삭제 성공시 ", async () => {
    let deletedWorkSpace = {
      name: "deletedWorkSpace",
      owner: "resign",
    };
    let deletedMember = {
      memberName: "test",
      memberEmail: "test@test.com",
      workSpace: "deletedWorkSpace",
    };
    workSpace.findOneAndDelete.mockReturnValue(deletedWorkSpace);
    member.deleteMany.mockReturnValue(deletedMember);
    await workSpaceController.deleteWorkSpace(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(deletedWorkSpace, deletedMember);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("deletedWorkSpace가 없다면 404를 반환합니다.", async () => {
    workSpace.findOneAndDelete.mockReturnValue(null);
    await workSpaceController.deleteWorkSpace(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
