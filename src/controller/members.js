const User = require('../models/user');
const workSpace = require('../models/workSpace');
const Inviting = require('../models/inviting');
const member = require('../models/member');

//멤버 추가(개발용)
async function addMember(req, res) {
  try {
    const existUser = res.locals.existUser;
    const { workSpaceName } = req.body;
    const existMember = res.locals.existMember;
    console.log("existMember: ", existMember);

    if (existMember) {
      return res
        .status(400)
        .json({ of: false, message: "이미 포함된 유저입니다." });
    } else {
      const addedMember = await member.create({
        memberEmail: existUser.userEmail,
        memberName: existUser.userName,
        workSpace: workSpaceName,
      });
      return res.status(201).json({ addedMember });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: "멤버 추가 에러" });
  }
}
//멤버 삭제
async function deleteMember(req, res) {
  try {
    const { owner } = res.locals.User;
    const myWorkSpace = res.locals.workSpace;
    const existMember = res.locals.existMember;
    if (owner.userEmail !== myWorkSpace.owner) {
      return res
        .status(400)
        .json({ success: false, message: "오너만 멤버를 삭제할 수 있습니다." });
    }
    if (!existMember) {
      return res
        .status(400)
        .json({ success: false, message: "해당 멤버가 없습니다." });
    } else {
      await member.deleteOne({ memberEmail, workSpace: workSpaceName });
      return res.status(200).json({
        success: true,
        message: "멤버 삭제 성공",
      });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: "멤버 삭제 에러" });
  }
}
//멤버 조회
async function getMemberList(req, res) {
  try {
    const { workSpaceName } = req.params;
    const memberList = await member.find({ workSpace: workSpaceName });
    return res.status(200).json({
      result: memberList,
      success: true,
      message: "목록 조회 성공",
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "멤버 목록 조회 에러" });
  }
}
//본인 속한 워크스페이스 목록 조회
async function showMyWorkSpaceList(req, res) {
  try {
    const { userEmail } = res.locals.User;
    const includedList = await member.find({ memberEmail: userEmail });
    console.log("workSpaceList: ", includedList);

    return res.status(200).json({
      includedList,
      success: true,
      message: "워크스페이스 목록 조회 성공",
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "소속 워크스페이스 목록 조회 실패" });
  }
}
//멤버 찾기
const searchMember = async (req, res, next) => {
  try {
    const { userEmail, workSpaceName } = req.body;
    const existMember = await member.findOne({
      workSpace: workSpaceName,
      memberEmail: userEmail,
    });
    console.log("멤버찾기에서 : ", existMember);
    if (existMember) {
      res.locals.existMember = existMember;
      next();
    }
    if (existMember === null) {
      next();
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: "멤버 찾기 에러" });
  }
};
//워크스페이스 탈퇴하기
async function leaveWorkSpace(req, res) {
  try {
    const { userEmail } = res.locals.User;
    const targetWorkSpace = res.locals.workSpace;
    if (targetWorkSpace.owner === userEmail) {
      return res.status(400).json({
        success: false,
        message:
          "본인이 만든 워크스페이스는 탈퇴할 수 없습니다.(단, 삭제 가능)",
      });
    }

    await member.deleteOne({ memberEmail: userEmail });
    return res.status(200).json({ success: true, message: "탈퇴 성공" });
  } catch (err) {
    return res.status(400).json({ success: false, message: "탈퇴 에러" });
  }
}

//멤버 초대
async function inviteMember(req, res) {
  try {
    const { userEmail, workSpaceName } = req.body;
    const { existMember } = res.locals;
    const { existUser } = res.locals;
    const invitedUser = await Inviting.findOne({ userEmail, workSpaceName });

    if (invitedUser) {
      return res
        .status(400)
        .json({ success: false, message: "이미 초대한 상대입니다." });
    }
    if (existMember) {
      return res
        .status(400)
        .json({ success: false, message: "이미 워크스페이스 멤버입니다." });
    }
    if (existUser) {
      const invitedUser = await Inviting.create({ userEmail, workSpaceName });
      return res.status(201).json({
        result: invitedUser,
        success: true,
        message: `${userEmail}를 초대하였습니다.`,
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "초대에 실패하였습니다." });
  }
}

//초대 조회
async function showInviting(req, res) {
  try {
    const { userEmail } = res.locals.User;

    const invitedUser = await Inviting.find({ userEmail: userEmail });

    if (invitedUser) {
      return res.status(200).json({
        result: invitedUser.workSpaceName,
        success: true,
        message: "초대 조회 성공",
      });
    }
    if (!invitedUser) {
      return res
        .status(404)
        .json({ success: false, message: "초대 내역에 없습니다." });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "초대 조회에 실패하였습니다." });
  }
}
//초대 수락
async function acceptInviting(req, res, next) {
  try {
    const user = res.locals.User;
    const existWorkSpace = res.locals.workSpace;
    console.log('초대수락에서 나오는 워크스페이스여부: ', existWorkSpace);
    const { existMember } = res.locals;
    console.log('초대수락에서 나오는 멤버여부: ', existMember);

    if (!existMember) {
      const createdMember = await member.create({
        memberEmail: user.userEmail,
        memberName: user.userName,
        workSpace: existWorkSpace.name,
      });
      res.locals.createdMember = createdMember;
      next();
    }
    else{
      return res.status(400).json({ success: false, message: "이미 멤버로 존재합니다." });
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(400).json({ success: false, message: "초대 수락 에러" });
  }
}

//초대장 삭제
async function deleteInviting(req, res) {
  try {
    const { userEmail } = res.locals.User;
    const { createdMember } = res.locals;
    await Inviting.deleteOne({ userEmail });
    if (createdMember) {
      res.status(200).json({
        createdMember,
        success: true,
        message: "초대 성공",
      });
    } else {
      res.status(200).json({
        createdMember,
        success: true,
        message: "초대 거절 성공",
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "초대 삭제에 실패하였습니다." });
  }
}

module.exports = {
  addMember,
  getMemberList,
  deleteMember,
  showMyWorkSpaceList,
  inviteMember,
  acceptInviting,
  deleteInviting,
  leaveWorkSpace,
  showInviting,
  searchMember,
};
