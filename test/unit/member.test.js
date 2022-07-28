const memberController = require("../../src/controller/members");
const httpMocks = require("node-mocks-http");
const newWorkSpace = require("../data/workSpace.json");
const newMember = require("../data/member.json");
const memberList = require("../data/memberList.json");
const workSpace = require("../../src/models/workSpace");
const member = require("../../src/models/member");
const localsUser = require("../data/locals.user.json");
const localsWorkSpace = require("../data/locals.workSpace.json");
const workSpaceList = require("../data/workSpaceList.json");

member.find = jest.fn();
member.findOne = jest.fn();
member.findOneAndDelete = jest.fn();

const existMember = localsUser;
const workSpaceName = newMember.workSpace;
let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
  res.locals.User = localsUser;
  res.locals.existWorkSpace = localsWorkSpace;
});

describe("멤버 목록 조회", () => {
  it("should have a getMemberList function", () => {
    expect(typeof memberController.getMemberList).toBe("function");
  });
  it("should call member.find({workSpace: workSpaceName})", async () => {
    req.params.workSpaceName = workSpaceName;
    await memberController.getMemberList(req, res, next);
    expect(member.find).toHaveBeenCalledWith({
      workSpace: req.params.workSpaceName,
    });
  });
  it("should return 200 response", async () => {
    await memberController.getMemberList(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });
  it("should return json body in response", async () => {
    member.find.mockReturnValue(memberList);
    await memberController.getMemberList(req, res, next);
    expect(res._getJSONData()).toStrictEqual({
      result: memberList,
      success: true,
      message: "목록 조회 성공",
    });
  });
});
describe("소속 워크스페이스 목록 조회", () => {
  it("should have a showMyWorkSpaceList function", () => {
    expect(typeof memberController.showMyWorkSpaceList).toBe("function");
  });
  it("should call member.find({memberEmail: userEmail})", async () => {
    await memberController.showMyWorkSpaceList(req, res, next);
    expect(member.find).toHaveBeenCalledWith({
      memberEmail: res.locals.User.userEmail,
    });
  });
  it("should return 200 response", async () => {
    await memberController.showMyWorkSpaceList(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });
  it("should return json body in response", async () => {
    member.find.mockReturnValue(workSpaceList);
    await memberController.showMyWorkSpaceList(req, res, next);
    expect(res._getJSONData()).toStrictEqual({
      includedList: workSpaceList,
      success: true,
      message: "워크스페이스 목록 조회 성공",
    });
  });
});
const userEmail = newMember.memberEmail;
describe("멤버 검색하기", () => {
  beforeEach(() => {
    req.body = { userEmail, workSpaceName };
  });
  it("should have a searchMember function", () => {
    expect(typeof memberController.searchMember).toBe("function");
  });
  it("should call member.findOne({workSpace: workSpaceName, memberEmail: userEmail})", async () => {
    await memberController.searchMember(req, res, next);
    expect(member.findOne).toHaveBeenCalledWith({
      memberEmail: userEmail,
      workSpace: workSpaceName,
    });
  });
  it("should return 200 response", async () => {
    await memberController.searchMember(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });
  it("검색 결과 여부에 상관없이 next()", async () => {
    member.findOne.mockReturnValue(existMember);
    await memberController.searchMember(req, res, next);
    expect(next).toBeCalledWith();
  });
});

describe("워크스페이스 탈퇴하기", () => {
  beforeEach(() => {
    res.locals.User = localsUser.userEmail;
    res.locals.workSpace = localsWorkSpace;
  });
  it("should have a searchMember function", () => {
    expect(typeof memberController.leaveWorkSpace).toBe("function");
  });
  it("should call member.deleteOne({ memberEmail: userEmail})", async () => {
    await memberController.leaveWorkSpace(req, res, next);
    expect(member.findOneAndDelete).toHaveBeenCalledWith({
      memberEmail: localsUser.userEmail, workSpace: localsWorkSpace.name
    });
  });
  it("should return 200 response", async () => {
    let deletedMember = {
      memberEmail : "deleted",
      workSpace : "deleted"
    }
    member.findOneAndDelete.mockReturnValue(deletedMember)
    await memberController.leaveWorkSpace(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({
      deletedMember,
      success: true,
      message: "탈퇴 성공",
    });
  });

  it("owner가 탈퇴하려고 할때 400반환 및 불가 메시지 반환 ", async () => {
    await memberController.leaveWorkSpace(req, res, next);
    const {userEmail} = localsUser;
    const targetWorkSpace = localsWorkSpace;
    if(userEmail === targetWorkSpace.owner){
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toStrictEqual({
        success: true,
        message: "탈퇴 성공",
      });
    }
  });
});
// if (localsUser.userEmail === targetWorkSpace.owner) {
