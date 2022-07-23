const workSpace = require("../schemas/workSpace");

//워크스페이스 생성
// router.post('/workSpace', authMiddleware, workSpaceController.createSpace);
async function createWorkSpace(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 생성 API'
    //##swagger.description='-'
     //만든이가 다른경우 워크스페이스 이름 중복가능을 위함
    const existWorkSpace = res.locals.workSpace;
    const user = res.locals.User;
    const { name } = req.body;
    const workSpaceName = `${user.userEmail}+${name}`;
    const memberList = [];
    memberList.push({ memberEmail: user.userEmail, memberName: user.userName }); //만든 사람 멤버리스트에 집어넣기

    if (existWorkSpace) {
      return res
        .status(400)
        .send({ errorMessage: "이미 존재하는 이름입니다." });
    } else {
      const createdWorkSpace = await workSpace.create({
        owner: user.userEmail,
        name: workSpaceName,
        memberList: memberList,
      });
      return res.json({ createdWorkSpace });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
      error,
    });
  }
}
//워크스페이스 탈퇴하기
// router.put('/workSpace/leave',authMiddleware,isMember,workSpaceController.workSpaceLeave);
async function leaveWorkSpace(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 탈퇴 API'
    //##swagger.description='-'
    const { userEmail } = res.locals.User;
    const targetWorkSpace = res.locals.workSpace;
    if (targetWorkSpace.owner === userEmail) {
      return res.status(400).json({
        success: false,
        message:
          "본인이 만든 워크스페이스는 탈퇴할 수 없습니다.(단, 삭제 가능)",
      });
    }
    const excepted = targetWorkSpace.memberList.filter(
      (memberInfo) => memberInfo.memberEmail !== userEmail
    );

    await workSpace.updateOne(
      { name: targetWorkSpace.name },
      { $set: { memberList: excepted } }
    );
    return res.status(200).json({ success: true, message: "탈퇴 성공" });
  } catch (err) {
    return res.status(400).json({ success: false, message: "탈퇴 에러" });
  }
}

//워크스페이스 삭제
// router.delete('/workSpace',authMiddleware,isMember,workSpaceController.deleteWorkSpace);
async function deleteWorkSpace(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 삭제 API'
    //##swagger.description='-'
    const { userEmail } = res.locals.User;
    const existWorkSpace = res.locals.workSpace;
    if (existWorkSpace === undefined) {
      res
        .status(404)
        .json({ success: false, message: "워크스페이스가 존재하지 않습니다." });
    }
    if (existWorkSpace.owner === userEmail) {
      const result = await workSpace.deleteOne({ name: existWorkSpace.name });
      return res
        .status(200)
        .json({
          result: result,
          success: true,
          message: "워크스페이스가 삭제되었습니다.",
        });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "워크스페이스 삭제 에러" });
  }
}
//본인 속한 워크스페이스 목록 조회
// router.get("/workSpace/workSpaceList", authMiddleware, workSpaceController.getWorkSpaceList);
async function showMyWorkSpaceList(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '본인이 속한 워크 스페이스 목록 조회 API'
    //#swagger.description='-'
    const { userEmail } = res.locals.User;
    const workSpaceList = await workSpace.find({});
    const includedList = [];
    workSpaceList.map((Info) =>
      Info.memberList.map((member) =>
        member.memberEmail === userEmail ? includedList.push(Info) : null
      )
    );
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

//전체 워크스페이스 조회
// router.get("/workSpace/everyWorkSpace", workSpaceController.everyWorkSpace);

async function showWorkSpaces(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '전체 워크스페이스 조회(개발용) API'
    //#swagger.description='-'
    const workSpaceList = await workSpace.find({});
    return res.status(200).json(
      workSpaceList
      // success: true,
      // message: "전체 워크스페이스 조회 성공",
    );
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "전체 워크스페이스 조회 실패" });
  }
}
//워크스페이스 검색
const searchWorkSpace = async (req, res, next) => {
  try {
    const user = res.locals.User;
    const { name } = req.body;
    const workSpaceName = `${user.userEmail}+${name}`;
    const existWorkSpace = await workSpace.findOne({ name: workSpaceName });
    console.log("워크스페이스 검색 결과: ", existWorkSpace);
    if (existWorkSpace) {
      await workSpace.findOne({ name: workSpaceName }).then((ws) => {
        res.locals.workSpace = ws;
        next();
      });
    } else if (existWorkSpace === null) {
      next();
    }
  } catch (error) {
    return res
      .status(400)
      .json({
        success: false,
        message: "워크스페이스 검색 에러",
        errorMessage: error.message,
      });
  }
};

module.exports = {
  createWorkSpace,
  leaveWorkSpace,
  deleteWorkSpace,
  showMyWorkSpaceList,
  showWorkSpaces,
  searchWorkSpace,
};
