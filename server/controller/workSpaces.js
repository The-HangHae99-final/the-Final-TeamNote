const workSpace = require("../schemas/workSpace");

//워크스페이스 생성
// router.post("/workSpace/create", authMiddleware, workSpaceController.create);
async function create(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 생성 API'
    //##swagger.description='-'
    const user = res.locals.User;
    const { name } = req.body;
    const workSpaceName = `${user.userEmail}+${name}`//만든이가 다른경우 워크스페이스 이름 중복가능을 위함
    const existName = await workSpace.find( { name: workSpaceName } );
    if (existName.length) {
      if (existName[0].owner === user.userEmail)
        return res
          .status(400)
          .send({ errorMessage: "이미 존재하는 이름입니다." });
    } else {
      const createdWorkSpace = await workSpace.create({
        owner: user.userEmail,
        name: workSpaceName
      });

      createdWorkSpace.memberList.push({
        memberEmail: user.userEmail,
        memberName: user.userName,
      });

      createdWorkSpace.save();

      return res.json({
        createdWorkSpace
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
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
    const { workSpaceName } = req.body;
    const targetWorkSpace = await workSpace.findOne({ name: workSpaceName });

    const excepted = targetWorkSpace.memberList.filter(
      (memberInfo) => memberInfo.memberEmail !== userEmail
    );

    await workSpace.updateOne(
      { name: workSpaceName },
      { $set: { memberList: excepted } }
    );
    return res.status(200).json({ ok: true, message: "탈퇴 성공" });
  } catch (err) {
    return res.status(400).json({ ok: false, message: "탈퇴 에러" });
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
    const { workSpaceName } = req.body;
    const targetWorkSpace = await workSpace.findOne({ name: workSpaceName });

    if (targetWorkSpace.owner === owner) {
      await workSpace.deleteMany({ name: workSpaceName });
      return res
        .status(200)
        .json({ ok: true, message: "워크스페이스가 삭제되었습니다." });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ ok: false, message: "워크스페이스 삭제 에러" });
  }
}

//본인 속한 워크스페이스 목록 조회
// router.get("/workSpace/workSpaceList", authMiddleware, workSpaceController.getWorkSpaceList);
async function getWorkSpaceList(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '본인이 속한 워크 스페이스 목록 조회 API'
    //#swagger.description='-'
    const { userEmail } = res.locals.User;
    const workSpaceList = await workSpace.find({});
    console.log("workSpaceList: ", workSpaceList);
    const includedList = [];

    workSpaceList.map((Info) =>
      Info.memberList.map((member) =>
        member.memberEmail === userEmail ? includedList.push(Info) : null
      )
    );
    return res.status(200).json({
      includedList,
      ok: true,
      message: "워크스페이스 목록 조회 성공",
    });
  } catch (err) {
    return res.status(400).json({ ok: false, message: " 에러싫어에러" });
  }
}

//전체 워크스페이스 조회
// router.get("/workSpace/everyWorkSpace", workSpaceController.everyWorkSpace);

async function everyWorkSpace(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '전체 워크스페이스 조회(개발용) API'
    //#swagger.description='-'
    const workSpaceList = await workSpace.find({});

    return res.status(200).json({
      workSpaceList,
      // ok: true,
      // message: "전체 워크스페이스 조회 성공",
    });
  } catch (err) {
    return res.status(400).json({ ok: false, message: "전체 워크스페이스 조회 실패" });
  }
}

module.exports = {
  create,
  workSpaceLeave,
  workSpaceRemove,
  getWorkSpaceList,
  everyWorkSpace,
};
