const workSpaceController = require("../server/controller/workSpaces");
const workSpace = require("../server/schemas/workSpace");
const workSpaceSchema = require("../server/schemas/workSpace");
const httpMocks = require("node-mocks-http");
const newWorkSpace = require("./data/workSpace.json");
const workSpaceList = require("./data/workSpaceList.json");

workSpaceSchema.create = jest.fn();
workSpaceSchema.find = jest.fn();
let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});
const userEmail = "test@test.com"
describe("workSpace Controller Create", () => {
  beforeEach(() => {
    req.body = newWorkSpace.name;
    result = {
      name: `${userEmail}+${req.body}`,
      owner: newWorkSpace.owner
    }
  });
  it("should have a create function", () => {
    expect(typeof workSpaceController.create).toBe("function");
  });
  it("should call workSpace.create", async () => {
    await workSpaceController.create(req, res, next);
    expect(workSpaceSchema.create).toBeCalledWith(result);
  });
  it("should return 200 response code", async () => {
    await workSpaceController.create(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });
  it("should return json body in res", async () => {
    workSpace.create.mockReturnValue(newWorkSpace);
    await workSpaceController.create(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newWorkSpace);
  });
  // it("should handle erros", async () => {
  //   const errorMessage = { message: "요청한 데이터 형식이 올바르지 않습니다." };
  //   const rejectedPromise = Promise.reject(errorMessage);
  //   workSpaceSchema.create.mockReturnValue(rejectedPromise);
  //   await workSpaceController.createProduct(req, res);
  //   expect(res.statusCode).toBe(400);
  //   expect(res).toBeCalledWith(errorMessage);
  // });

  
});

describe("workSpace Controller 전체조회", () => {
  it("should have a getworkSpaces function", () => {
    expect(typeof workSpaceController.everyWorkSpace).toBe("function");
  });
  it("should call workSpace.find({})", async () => {
    await workSpaceController.everyWorkSpace(req, res, next);
    expect(workSpaceSchema.find).toHaveBeenCalledWith({});
  });
  it("should return 200 response", async () => {
    await workSpaceController.everyWorkSpace(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });
  it("should return json body in response", async () => {
    workSpace.find.mockReturnValue(workSpaceList);
    await workSpaceController.everyWorkSpace(req, res, next);
    expect(res._getJSONData()).toStrictEqual({workSpaceList: workSpaceList});
  });
});

