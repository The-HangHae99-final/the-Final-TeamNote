const User = require('../schemas/user');
const workSpace = require('../schemas/workSpace');

//워크스페이스 생성
// router.post("/workSpace/create", authMiddleware, workSpaceController.create);
async function create(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 생성 API'
    //##swagger.description='-'
    const owner = res.locals.User[0];
    console.log('owner: ', owner);

    const { name } = req.body;
    console.log('name: ', name);

    const fullName = `${owner.userEmail}+${name}`;
    console.log('fullName: ', fullName);
    const existName = await workSpace.find({ name: fullName });
    console.log('existName: ', existName);

    let memberList = [];
    memberList.push(owner.userEmail);

    if (existName.length) {
      if (existName[0].owner === owner.userEmail)
        return res
          .status(400)
          .send({ errorMessage: '이미 존재하는 이름입니다.' });
    } else {
      const createdWorkSpace = await workSpace.create({
        owner: owner.userEmail,
        name: `${owner.userEmail}+${name}`,
        memberEmail: owner.userEmail,
        memberName: owner.userName,
        memberList: memberList,
      });

      return res.json({
        result: createdWorkSpace,
        success: true,
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

//워크스페이스 탈퇴하기
// router.put("/workSpace/workSpaceLeave/:workSpaceName", authMiddleware, // workSpaceController.workSpaceLeave);
async function workSpaceLeave(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 탈퇴 API'
    //##swagger.description='-'
    const userEmail = res.locals.User.userEmail;
    const { workSpaceName } = req.body;
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
// router.delete("/workSpace/workSpaceRemove/:workSpaceName", authMiddleware, // workSpaceController.workSpaceRemove);
async function workSpaceRemove(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 삭제 API'
    //##swagger.description='-'
    const owner = res.locals.User.userEmail;
    const { workSpaceName } = req.body;
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

//본인 속한 워크스페이스 목록 조회
// router.get("/workSpace/workSpaceList", authMiddleware, workSpaceController.getWorkSpaceList);
async function getWorkSpaceList(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '본인이 속한 워크 스페이스 목록 조회 API'
    //#swagger.description='-'
    const { userEmail } = res.locals.User[0];
    console.log('userEmail: ', userEmail);
    const includedList = [];
    const workSpaceList = await workSpace.find({ userEmail });

    if (!workSpaceList) {
      return res
        .status(201)
        .json({ message: '조회할 워크스페이스가 없습니다.' });
    } else {
      includedList.push(workSpaceList);
    }
    // workSpaceList.map((Info) =>
    //   Info.memberList.map((member) =>
    //     member.memberEmail === userEmail ? includedList.push(Info) : null
    //   )
    // );
    return res.status(200).json({
      includedList,
      success: true,
      message: '워크스페이스 목록 조회 성공',
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: ' 특정 할 수 없는 에러가 발생했습니다.',
      errorMessage: err.message,
    });
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
    return res.status(400).json({
      success: false,
      message: '특정 할 수 없는 에러가 발생했습니다.',
      errorMessage: err.message,
    });
  }
}

module.exports = {
  create,
  workSpaceLeave,
  workSpaceRemove,
  getWorkSpaceList,
  everyWorkSpace,
};
