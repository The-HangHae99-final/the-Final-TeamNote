const User = require('../schemas/user');
const workSpace = require('../schemas/workSpace');

//워크스페이스 생성
// router.post("/workSpace/create", authMiddleware, workSpaceController.create);
async function create(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 생성 API'
    //##swagger.description='-'
    const owner = res.locals.User;
    const { name } = req.body;
    const fullName = `${owner.userEmail}+${name}`;
    const existName = await workSpace.find({ name: fullName });
    console.log('owner.user--------' + owner.userEmail);
    if (existName.length) {
      if (existName[0].owner === owner.userEmail)
        return res
          .status(400)
          .send({ errorMessage: '이미 존재하는 이름입니다.' });
    } else {
      const createdWorkSpace = await workSpace.create({
        owner: owner.userEmail,
        name: `${owner.userEmail}+${name}`,
      });

      createdWorkSpace.memberList.push({
        memberEmail: owner.userEmail,
        memberName: owner.userName,
      });

      createdWorkSpace.save();

      return res.json({
        result: createdWorkSpace,
        ok: true,
        message: '워크스페이스 생성 성공',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
}

//멤버 추가
// router.put("/workSpace/memberAdd/:workSpaceName", authMiddleware,isMember, workSpaceController.memberAdd);
async function memberAdd(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 멤버 추가 API'
    //##swagger.description='-'
    const { workSpaceName } = req.params;
    const { userEmail } = req.body;

    const [myWorkSpace] = await workSpace.find({ name: workSpaceName });
    const existCheck = await User.findOne({ userEmail: userEmail });
    const existMember = myWorkSpace.memberList.filter(
      (memberInfo) => memberInfo.memberEmail === userEmail
    );

    if (!existCheck) {
      return res
        .status(400)
        .json({ ok: false, message: '존재하지 않는 유저입니다.' });
    } else if (existMember.length) {
      return res
        .status(400)
        .json({ of: false, message: '이미 포함된 유저입니다.' });
    } else {
      myWorkSpace.memberList.push({
        memberEmail: existCheck.userEmail,
        memberName: existCheck.userName,
      });
      myWorkSpace.save();

      return res.status(200).json({
        result: myWorkSpace,
        ok: true,
        message: '멤버 추가 성공',
      });
    }
  } catch (err) {
    return res.status(400).json({ ok: false, message: '멤버 추가 에러' });
  }
}
//멤버 삭제
// router.put("/workSpace/deleteMember/:workSpaceName", authMiddleware, isMember, workSpaceController.deleteMember);
async function deleteMember(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 멤버 삭제 API'
    //##swagger.description='-'
    const authority = res.locals.User;
    const { workSpaceName } = req.params;
    const { memberEmail } = req.body;
    const myWorkSpace = await workSpace.findOne({ name: workSpaceName });
    const existMember = myWorkSpace.memberList.filter(
      (memberInfo) => memberInfo.memberEmail === memberEmail
    );
    if (authority.userEmail !== myWorkSpace.owner) {
      return res
        .status(400)
        .json({ ok: false, message: '오너만 멤버를 삭제할 수 있습니다.' });
    } else if (!existMember.length) {
      return res
        .status(400)
        .json({ ok: false, message: '해당 멤버가 없습니다.' });
    } else {
      const filtered = myWorkSpace.memberList.filter(
        (memberInfo) => memberInfo.memberEmail !== memberEmail
      );
      await workSpace.updateOne(
        { name: workSpaceName },
        { $set: { memberList: filtered } }
      );
      console.log('filtered: ', filtered);

      return res.status(200).json({
        ok: true,
        message: '멤버 삭제 성공',
      });
    }
  } catch (err) {
    return res.status(400).json({ ok: false, message: '멤버 삭제 에러' });
  }
}
//멤버 목록 조회
// router.get("/workSpace/MemberList/:workSpaceName", authMiddleware, isMember, workSpaceController.getMemberList);
async function getMemberList(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 멤버 조회 API'
    //##swagger.description='-'
    const { workSpaceName } = req.params;
    console.log(workSpaceName);
    const memberList = await workSpace.findOne({ name: workSpaceName });
    console.log('memberList: ', memberList);
    return res.status(200).json({
      result: memberList.memberList,
      ok: true,
      message: '목록 조회 성공',
    });
  } catch (err) {
    return res.status(400).json({ ok: false, message: '멤버 목록 조회 에러' });
  }
}

//워크스페이스 탈퇴하기
// router.put("/workSpace/workSpaceLeave/:workSpaceName", authMiddleware, isMember, workSpaceController.workSpaceLeave);
async function workSpaceLeave(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 탈퇴 API'
    //##swagger.description='-'
    const userEmail = res.locals.User.userEmail;
    const { workSpaceName } = req.params;
    const targetWorkSpace = await workSpace.findOne({ name: workSpaceName });

    const excepted = targetWorkSpace.memberList.filter(
      (memberInfo) => memberInfo.memberEmail !== userEmail
    );

    await workSpace.updateOne(
      { name: workSpaceName },
      { $set: { memberList: excepted } }
    );
    return res.status(200).json({ ok: true, message: '탈퇴 성공' });
  } catch (err) {
    return res.status(400).json({ ok: false, message: '탈퇴 에러' });
  }
}

//워크스페이스 삭제
// router.delete("/workSpace/workSpaceRemove/:workSpaceName", authMiddleware, isMember, workSpaceController.workSpaceRemove);
async function workSpaceRemove(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 삭제 API'
    //##swagger.description='-'
    const owner = res.locals.User.userEmail;
    const { workSpaceName } = req.params;
    const targetWorkSpace = await workSpace.findOne({ name: workSpaceName });

    if (targetWorkSpace.owner === owner) {
      await workSpace.deleteMany({ name: workSpaceName });
      return res
        .status(200)
        .json({ ok: true, message: '워크스페이스가 삭제되었습니다.' });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ ok: false, message: '워크스페이스 삭제 에러' });
  }
}

//방 이름 건네주기
// router.get("/workSpace/getRoomName/:workSpaceName/:opponent", authMiddleware, isMember, workSpaceController.roomName);
async function roomName(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '방 이름 건네주기 API'
    //#swagger.description='-'
    const me = res.locals.User.userName;
    const { workSpaceName } = req.params;
    const { opponent } = req.params;

    const existWorkSpace = await workSpace.findOne({ name: workSpaceName });
    for (let i = 0; i < existWorkSpace.memberList.length; i++) {
      if (existWorkSpace.memberList[i].memberName === opponent) {
        const roomId = [me, opponent];
        roomId.sort();

        return res.status(200).json({
          result: roomId[0] + roomId[1],

          ok: true,
          message: '룸 이름 얻기 성공',
        });
      }
    }
  } catch (err) {
    return res.status(400).json({ ok: false, message: ' 에러싫어에러' });
  }
}

//본인 속한 워크스페이스 목록 조회
// router.get("/workSpace/workSpaceList", authMiddleware, workSpaceController.getWorkSpaceList);
async function getWorkSpaceList(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '본인이 속한 워크 스페이스 목록 조회 API'
    //#swagger.description='-'
    const {userEmail} = res.locals.User;
    const workSpaceList = await workSpace.find({});
    console.log('workSpaceList: ', workSpaceList);
    
    const includedList = [];
    workSpaceList.map((Info) =>
      Info.memberList.map((member) => member.memberEmail === userEmail ? includedList.push(Info): null)
    );
    return res.status(200).json({
      includedList,
      ok: true,
      message: '워크스페이스 목록 조회 성공',
    });
  } catch (err) {
    return res.status(400).json({ ok: false, message: '소속 워크스페이스 목록 조회 실패!' });
  }
}

//전체 워크스페이스 조회
// router.get("/workSpace/everyWorkSpace", workSpaceController.everyWorkSpace);

async function everyWorkSpace(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '전체 워크스페이스 조회(개발용) API'
    //#swagger.description='-'
    const workSpaceList = await workSpace.find();

    return res.status(200).json({
      workSpaceList,
      ok: true,
      message: '전체 워크스페이스 조회 성공',
    });
  } catch (err) {
    return res.status(400).json({ ok: false, message: ' 에러싫어에러' });
  }
}

module.exports = {
  create,
  memberAdd,
  roomName,
  getMemberList,
  deleteMember,
  workSpaceLeave,
  workSpaceRemove,
  getWorkSpaceList,
  everyWorkSpace,
};
