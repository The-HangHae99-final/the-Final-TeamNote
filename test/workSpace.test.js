const workSpaceController = require("../server/controller/workSpaces");
const workSpaceSchema = require("../server/schemas/workSpace");
const httpMocks = require("node-mocks-http");
const newWorkSpace = require("./data/workSpace.json");

workSpaceSchema.create = jest.fn();

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = null;
});

describe("workSpace Controller Create", () => {
  beforeEach(() => {
    req.body = newWorkSpace;
  });
  it("should have a create function", () => {
    expect(typeof workSpaceController.create).toBe("function");
  });

  it("should call workSpaceSchema.create", () => {
    
    workSpaceController.create(req, res, next);
    expect(workSpaceController.create).toBeCalledWith(
      req.body
    );
  });
  it("should return 200 response code", () => {
    workSpaceController.create(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();

  });
});
