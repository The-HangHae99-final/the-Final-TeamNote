const workSpaceController = require("../../src/controller/workSpaces");
const workSpace = require("../../src/models/workSpace");
const member = require("../../src/models/member");
const httpMocks = require("node-mocks-http");
const newWorkSpace = require("../data/workSpace.json");
const workSpaceList = require("../data/workSpaceList.json");
const localsUser = require("../data/locals.user.json");
const newMember = require("../data/member.json");
const localsWorkSpace = require("../data/locals.workSpace.json");

workSpace.create = jest.fn();
workSpace.find = jest.fn();
workSpace.findOne = jest.fn();
workSpace.deleteOne = jest.fn();
member.create = jest.fn();
member.deleteMany = jest.fn();

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
  res.locals.User = localsUser;
  res.locals.existWorkSpace = localsWorkSpace;
});
describe("워크스페이스 생성", () => {
  beforeEach(() => {
    res.locals.User = localsUser;
    res.locals.existWorkSpace = localsWorkSpace;
    req.body = { name: newWorkSpace.name };
  });
  it("createWorkSpace는 함수이다.", () => {
    expect(typeof workSpaceController.createWorkSpace).toBe("function");
  });
  it("workSpace.createWorkSpace는 호출해야한다.", async () => {
    await workSpaceController.createWorkSpace(req, res, next);
    expect(workSpace.create).toBeCalledWith(newWorkSpace);
    // expect(member.create).toBeCalledWith(newMember);
  });
  it("should return 201 response code", async () => {
    await workSpaceController.createWorkSpace(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled).toBeTruthy();
  });
  it("should return json body in res", async () => {
    workSpace.create.mockReturnValue(newWorkSpace);
    await workSpaceController.createWorkSpace(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newWorkSpace);
  });
});

describe("워크스페이스 전체조회", () => {
  it("should have a getworkSpaces function", () => {
    expect(typeof workSpaceController.showWorkSpaces).toBe("function");
  });
  it("should call workSpace.find({})", async () => {
    await workSpaceController.showWorkSpaces(req, res, next);
    expect(workSpace.find).toHaveBeenCalledWith({});
  });
  it("should return 200 response", async () => {
    await workSpaceController.showWorkSpaces(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });
  it("should return json body in response", async () => {
    workSpace.find.mockReturnValue(workSpaceList);
    await workSpaceController.showWorkSpaces(req, res, next);
    expect(res._getJSONData()).toStrictEqual(workSpaceList);
  });
});

describe("워크스페이스 검색", () => {
  it("should have a searchWorkSpace function", () => {
    expect(typeof workSpaceController.searchWorkSpace).toBe("function");
  });
  it("workSpace.findOne 검색 결과 없으면 호출 값", async () => {
    await workSpaceController.searchWorkSpace(req, res, next);
    expect(workSpace.findOne).toHaveBeenCalledWith({name: undefined});
  });
  it("workSpace.findOne 검색 결과 있으면 호출 값", async () => {
    await workSpaceController.searchWorkSpace(req, res, next);
    expect(workSpace.findOne).toHaveBeenCalledWith({name: undefined});
  });
  it("검색 결과가 있으면 next 처리.", async () => {
    workSpace.findOne.mockReturnValue(newWorkSpace);
    await workSpaceController.searchWorkSpace(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });
  it("검색 결과가 없으면 next 처리.", async () => {
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
    it("workSpace.deleteOne , member.deleteMany를 호출한다. ", async () => {
      await workSpaceController.deleteWorkSpace(req, res, next);
      expect(workSpace.deleteOne).toHaveBeenCalledWith();;
      expect(member.deleteMany).toHaveBeenCalledWith();;
    });
    it("should return 200 response ", async () => {
      let deletedWorkSpace = {
        name: "deletedWorkSpace",
        owner: "resign",
      };
      let deletedMember = {
        memberName: "test",
        memberEmail: "test@test.com",
        workSpace: "deletedWorkSpace",
      };
      workSpace.deleteOne.mockReturnValue(deletedWorkSpace);
      member.deleteMany.mockReturnValue(deletedMember);
      await workSpaceController.deleteWorkSpace(req, res, next);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual({
        result: { deletedWorkSpace, deletedMember },
        success: true,
        message: "워크스페이스가 삭제되었습니다.",
      });
      expect(res._isEndCalled()).toBeTruthy();
    });
    it("should handle 404 when item doenst exist", async () => {
      WorkSpaceModel.findByIdAndDelete.mockReturnValue(null);
      await WorkSpaceController.deleteWorkSpace(req, res, next);
      expect(res.statusCode).toBe(404);
      expect(res._isEndCalled()).toBeTruthy();
    });

    // it("should handle errors", async () => {
    //   const errorMessage = { message: "Error deleting" };
    //   const rejectedPromise = Promise.reject(errorMessage);
    //   WorkSpaceModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
    //   await WorkSpaceController.deleteWorkSpace(req, res, next);
    //   expect(next).toHaveBeenCalledWith(errorMessage);
    // });
  });
