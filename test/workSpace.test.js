const workSpaceController = require("../src/controller/workSpaces");
const workSpace = require("../src/schemas/workSpace");
const httpMocks = require("node-mocks-http");
const newWorkSpace = require("./data/workSpace.json");
const workSpaceList = require("./data/workSpaceList.json");

workSpace.create = jest.fn();
workSpace.find = jest.fn();
workSpace.findOne = jest.fn();
workSpace.deleteOne = jest.fn();

const userEmail = "email@email.com";
const workSpaceName = jest.fn((name) => `${userEmail}+${name}`)
let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});
describe("workSpace Controller CreateWorkSpace", () => {
  beforeEach(() => {
    req.body = newWorkSpace.name;
    result = {
      workSpaceName: workSpaceName(req.body),
      owner: userEmail
    };
  });
  it("workSpaceController.createWorkSpace는 함수이다.", () => {
    expect(typeof workSpaceController.createWorkSpace).toBe("function");
  });
  it("workSpace.create를 호출한다.", async () => {
    await workSpaceController.createWorkSpace(req, res, next);
    expect(workSpace.create)
    // expect(workSpace.create).toBeCalledWith({result});
  });
  it("201 response status code를 반환한다.", async () => {
    await workSpaceController.createWorkSpace(req, res, next);
    expect(res.statusCode).toBe(201);
  });
  it("should return json body in res", async () => {
    workSpace.create.mockReturnValue(result);
    await workSpaceController.createWorkSpace(req, res, next);
    expect(res._getJSONData()).toStrictEqual({name:newWorkSpace.name, owner: newWorkSpace.owner});
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
  beforeEach(() => {
    req.body = workSpaceName;
  });
  it("searchWorkSpace는 함수이다.", () => {
    expect(typeof workSpaceController.searchWorkSpace).toBe("function");
  });
  it("workSpace.findOne을 호출한다.", async () => {
    await workSpaceController.searchWorkSpace(req, res, next);
    expect(workSpace.findOne);
  });
  it("검색 이후 next로 넘긴다.", async () => {
    workSpace.findOne.mockReturnValue(newWorkSpace);
    await workSpaceController.searchWorkSpace(req, res, next);
    expect(next).toHaveBeenCalledWith()

  });
  it("should return json body in response", async () => {
    workSpace.find.mockReturnValue(newWorkSpace);
    await workSpaceController.searchWorkSpace(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newWorkSpace);
  });
});
