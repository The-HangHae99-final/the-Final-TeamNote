const memberController = require("../../src/controller/members");
const httpMocks = require("node-mocks-http");
const newWorkSpace = require("../data/workSpace.json");
const newInviting = require("../data/inviting.json");
const memberData = require("../data/member.json");
const memberList = require("../data/memberList.json");
const member = require("../../src/models/member");
const Inviting = require("../../src/models/inviting");

const localsUser = require("../data/locals.user.json");
const localsWorkSpace = require("../data/locals.workSpace.json");
const workSpaceList = require("../data/workSpaceList.json");

member.create = jest.fn();
member.find = jest.fn();
member.findOne = jest.fn();
member.findOneAndDelete = jest.fn();
member.deleteOne = jest.fn();
Inviting.find = jest.fn();
Inviting.deleteOne = jest.fn();
Inviting.create = jest.fn();
Inviting.findOne = jest.fn();

const invitedUser = newInviting;
const existMember = localsUser;
const workSpaceName = memberData.workSpace;

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
  res.locals.User = localsUser;
  res.locals.existWorkSpace = localsWorkSpace;
});

describe("멤버 목록 조회", () => {
  it("getMemberList은 함수이다.", () => {
    expect(typeof memberController.getMemberList).toBe("function");
  });
  it("member.find는 다음 내용을 호출한다.", async () => {
    req.params.workSpaceName = workSpaceName;
    await memberController.getMemberList(req, res, next);
    expect(member.find).toHaveBeenCalledWith({
      workSpace: req.params.workSpaceName,
    });
  });
  it("성공시 응답 코드 200 반환", async () => {
    await memberController.getMemberList(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });
  it("성공시 JSON형식 데이터 반환", async () => {
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
  it("showMyWorkSpaceList은 함수이다.", () => {
    expect(typeof memberController.showMyWorkSpaceList).toBe("function");
  });
  it("member.find는 다음 내용을 호출한다.", async () => {
    await memberController.showMyWorkSpaceList(req, res, next);
    expect(member.find).toHaveBeenCalledWith({
      memberEmail: res.locals.User.userEmail,
    });
  });
  it("성공시 응답 코드 200 반환", async () => {
    await memberController.showMyWorkSpaceList(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });
  it("성공시 JSON형식 데이터 반환", async () => {
    member.find.mockReturnValue(workSpaceList);
    await memberController.showMyWorkSpaceList(req, res, next);
    expect(res._getJSONData()).toStrictEqual({
      includedList: workSpaceList,
      success: true,
      message: "워크스페이스 목록 조회 성공",
    });
  });
});
const userEmail = memberData.memberEmail;
describe("멤버 검색하기", () => {
  beforeEach(() => {
    req.body = { userEmail, workSpaceName };
  });
  it("searchMember은 함수이다.", () => {
    expect(typeof memberController.searchMember).toBe("function");
  });
  it("member.findOne은 다음내용을 호출한다", async () => {
    await memberController.searchMember(req, res, next);
    expect(member.findOne).toHaveBeenCalledWith({
      memberEmail: userEmail,
      workSpace: workSpaceName,
    });
  });
  it("성공시 응답 코드 200 반환", async () => {
    await memberController.searchMember(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });
  it("멤버를 찾은경우 next()", async () => {
    member.findOne.mockReturnValue(existMember);
    await memberController.searchMember(req, res, next);
    expect(next).toBeCalledWith();
  });

  it("값이 비어있어도 next()", async () => {
    member.findOne.mockReturnValue(null);
    await memberController.searchMember(req, res, next);
    expect(next).toBeCalledWith();
  });
});

describe("워크스페이스 탈퇴하기", () => {
  beforeEach(() => {
    res.locals.User = localsUser.userEmail;
    res.locals.workSpace = localsWorkSpace;
  });
  it("searchMember은 함수이다.", () => {
    expect(typeof memberController.leaveWorkSpace).toBe("function");
  });
  it("member.deleteOne은 다음내용을 호출한다", async () => {
    const targetWorkSpace = localsWorkSpace;
    const { userEmail } = localsUser.userEmail;
    await memberController.leaveWorkSpace(req, res, next);
    expect(member.findOneAndDelete).toHaveBeenCalledWith({
      memberEmail: userEmail,
      workSpace: targetWorkSpace.name,
    });
  });
  it("탈퇴 성공시 응답 코드 200 및 JSON형식 데이터 반환", async () => {
    let deletedMember = {
      memberEmail: "deleted",
      workSpace: "deleted",
    };
    member.findOneAndDelete.mockReturnValue(deletedMember);
    await memberController.leaveWorkSpace(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({
      deletedMember,
      success: true,
      message: "탈퇴 성공",
    });
  });
});

describe("멤버 삭제하기", () => {
  beforeEach(() => {
    res.locals.User = localsUser.userEmail;
    res.locals.workSpace = localsWorkSpace;
    res.locals.existMember = memberData;
  });
  it("deleteMember 는 함수이다.", () => {
    expect(typeof memberController.deleteMember).toBe("function");
  });
  it("워크스페이스에 멤버가 없는 경우", async () => {
    res.locals.existMember = null;
    await memberController.deleteMember(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({
      success: false,
      message: "해당 멤버가 없습니다.",
    });
  });
  it(" member.deleteOne 은 다음내용을 호출한다.", async () => {
    const myWorkSpace = localsWorkSpace;
    await memberController.deleteMember(req, res, next);
    expect(member.deleteOne).toHaveBeenCalledWith({
      workSpace: myWorkSpace.name,
      memberEmail: memberData.memberEmail,
    });
  });
  it("삭제성공시 응답 코드 200 및 JSON형식 데이터 반환", async () => {
    let deletedMember = {
      memberEmail: "deleted",
      workSpace: "deleted",
    };
    member.deleteOne.mockReturnValue(deletedMember);
    await memberController.deleteMember(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({
      deletedMember,
      success: true,
      message: "멤버 삭제 성공",
    });
  });
});

describe("초대 하기", () => {
  beforeEach(() => {
    req.body = { userEmail, workSpaceName };
  });
  it("inviteMember은 함수이다.", () => {
    expect(typeof memberController.inviteMember).toBe("function");
  });
  it("Inviting.findOne 은 다음내용을 호출한다.", async () => {
    const workSpaceName = newWorkSpace.name;
    const inviter = localsUser.userName;
    await memberController.inviteMember(req, res, next);
    expect(Inviting.findOne).toHaveBeenCalledWith({
      userEmail,
      workSpaceName,
    });
    expect(Inviting.create).toBeCalledWith({
      userEmail,
      workSpaceName,
      inviter,
    });
  });
  it("이미 초대한 상대일 경우", async () => {
    const existInviting = "exist";
    Inviting.findOne.mockReturnValue(existInviting);
    await memberController.inviteMember(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled).toBeTruthy();
  });

  it("이미 워크스페이스 멤버일 경우", async () => {
    const existMember = "exist";
    expect(existMember);
    await memberController.inviteMember(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(res._isEndCalled).toBeTruthy();
  });
});

describe("초대장 조회", () => {
  it("showInviting 은 함수이다.", () => {
    expect(typeof memberController.showInviting).toBe("function");
  });
  it("Inviting.find 은 다음내용을 호출한다.", async () => {
    await memberController.showInviting(req, res, next);
    expect(Inviting.find).toHaveBeenCalledWith({
      userEmail: localsUser.userEmail,
    });
  });
  it("조회 성공시 응답 코드 200 반환", async () => {
    Inviting.find.mockReturnValue(invitedUser);
    await memberController.showInviting(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  });
  it("invitedUser가 있는 경우", async () => {
    Inviting.find.mockReturnValue(invitedUser);
    await memberController.showInviting(req, res, next);
    expect(res._getJSONData()).toStrictEqual({
      result: invitedUser,
      success: true,
      message: "초대 조회 성공",
    });
  });

  it("invitedUser가 없는 경우", async () => {
    Inviting.find.mockReturnValue(!invitedUser);
    await memberController.showInviting(req, res, next);
    expect(res._getJSONData()).toStrictEqual({
      success: false,
      message: "초대 내역에 없습니다.",
    });
  });
});

describe("초대 수락 -> 멤버 생성", () => {
  beforeEach(() => {
    res.locals.User = localsUser;
    res.locals.existWorkSpace = localsWorkSpace;
    req.body = { userEmail, workSpaceName };
  });
  it("acceptInviting는 함수이다.", () => {
    expect(typeof memberController.acceptInviting).toBe("function");
  });
  it("member.create는 다음과 같은 내용을 호출해야한다.", async () => {
    const user = res.locals.User;
    await memberController.acceptInviting(req, res, next);
    expect(member.create).toBeCalledWith({
      memberEmail: user.userEmail,
      memberName: user.userName,
      workSpace: workSpaceName,
    });
  });
  it("member를 생성하고 next처리한다.", async () => {
    await memberController.acceptInviting(req, res, next);
    expect(member.create).toBeCalledWith({
      memberEmail: localsUser.userEmail,
      memberName: localsUser.userName,
      workSpace: workSpaceName,
    });
    expect(next);
  });
});

describe("초대장 삭제", () => {
  beforeEach(() => {
    res.locals.User = localsUser.userEmail;
    res.locals.workSpace = localsWorkSpace;
    res.locals.createdMember = memberData;
  });
  it("searchMember는 함수이다.", () => {
    expect(typeof memberController.deleteInviting).toBe("function");
  });

  it("Inviting.deleteOne({ userEmail })을 호출한다.", async () => {
    const { userEmail } = localsUser.userEmail;
    await memberController.deleteInviting(req, res, next);
    expect(Inviting.deleteOne).toHaveBeenCalledWith({
      userEmail,
    });
  });

  it("초대 수락한 경우", async () => {
    let createdMember = res.locals.createdMember;
    await memberController.deleteInviting(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({
      createdMember,
      success: true,
      message: "초대 성공",
    });
  });

  it("초대 거절한 경우", async () => {
    res.locals.createdMember = null;
    await memberController.deleteInviting(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({
      success: true,
      message: "초대 거절 성공",
    });
  });
});
