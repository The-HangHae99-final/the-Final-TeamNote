const workSpace = require("../models/workSpace");
const member = require("../models/member");

//워크스페이스 생성
async function createWorkSpace(req, res, next) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '전체 워크스페이스 생성 API'
    //#swagger.description='-'
    const existWorkSpace = res.locals.workSpace;
    const user = res.locals.User;
    const { workSpaceName } = req.body;

    if (existWorkSpace) {
      return res
        .status(400)
        .json({ errorMessage: "이미 존재하는 이름입니다." });
    }
    const createdWorkSpace = await workSpace.create({
      owner: user.userEmail,
      workSpaceName: workSpaceName,
    });
    res.locals.createdWorkSpace = createdWorkSpace;
    next();

    // const addedOwner = await member.create({
    //   memberEmail: user.userEmail,
    //   memberName: user.userName,
    //   workSpace: workSpaceName,
    //   profile_image: user.profile_image
    // });
    // return res.status(201).json({createdWorkSpace, addedOwner});
  } catch (err) {
    console.log(err);
    res.status(400).json({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

async function addOwner(req, res, next) {
  try {
    const createdWorkSpace = res.locals.createdWorkSpace;
    const user = res.locals.User;

    const addedOwner = await member.create({
      memberEmail: user.userEmail,
      memberName: user.userName,
      workSpaceId: createdWorkSpace._id,
      workSpaceName: createdWorkSpace.workSpaceName,
      profile_image: user.profile_image,
    });
    return res.status(201).json({ createdWorkSpace, addedOwner });
  } catch (err) {
    // console.log(err);
    res.status(400).json({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
}

//워크스페이스 삭제
async function deleteWorkSpace(req, res) {
  try {
    const { workSpaceId } = req.body;

    const deletedWorkSpace = await workSpace.findByIdAndDelete({
      workSpace: workSpaceId,
    });
    const deletedMembers = await member.deleteMany({
      workSpace: workSpaceId,
    });
    if (deletedWorkSpace) {
      res.status(200).json(deletedWorkSpace, deletedMembers);
    } else {
      res.status(404).json();
    }
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "워크스페이스 삭제 에러" });
  }
}

//전체 워크스페이스 조회
async function showWorkSpaces(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '전체 워크스페이스 조회(개발용) API'
    //#swagger.description='-'
    const workSpaceList = await workSpace.find({});
    console.log("workSpaceList: ", workSpaceList);

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
    const { workSpaceName } = req.body;
    console.log("workSpaceName: ", workSpaceName);
    const existWorkSpace = await workSpace.find({ workSpaceName });
    console.log("검색 결과: ", existWorkSpace);
    if (existWorkSpace.length) {
      res.locals.workSpace = existWorkSpace;
      next();
    }
    else{
      next();
    }
    
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "워크스페이스 검색 에러",
    });
  }
};

module.exports = {
  createWorkSpace,
  deleteWorkSpace,
  showWorkSpaces,
  searchWorkSpace,
  addOwner,
};
