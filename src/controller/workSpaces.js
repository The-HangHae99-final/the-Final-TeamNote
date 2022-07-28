const workSpace = require('../models/workSpace');
const member = require('../models/member');

//워크스페이스 생성
async function createWorkSpace(req, res, next) {
  try {
    const existWorkSpace = res.locals.workSpace;
    console.log('넥스트 받아올수 있을까요.: ', existWorkSpace);
    const user = res.locals.User;
    console.log('유저 이메일 값을 꺼내볼게요: ', user.userEmail);
    const { workSpaceName } = req.body;
    console.log('바디값으로 받았어요.: ', workSpaceName);
    const ownerEmail = workSpaceName.split('+')[0]
    console.log('ownerEmail: ', ownerEmail);
    
    if(ownerEmail !== user.userEmail){return res
      .status(400)
      .send({ errorMessage: '워크스페이스 이름 값을 전달하는 과정에서 오류 발생하였음.' });}

    //만든이가 다른경우 워크스페이스 이름 중복가능을 위함
    if (existWorkSpace) {
      return res
        .status(400)
        .send({ errorMessage: '이미 존재하는 이름입니다.' });
    } else {
      const createdWorkSpace = await workSpace.create({
        owner: user.userEmail,
        name: workSpaceName,
      });
      const addedOwner = await member.create({
        memberEmail: user.userEmail,
        memberName: user.userName,
        workSpace: workSpaceName,
      });
      return res.json({ createdWorkSpace, addedOwner });
    }
  } catch (err) {
    next(err)
    // console.log(err);
    // res.status(400).send({
    //   errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    //   error,
    // });
  }
}

//워크스페이스 삭제
async function deleteWorkSpace(req, res) {
  try {
    const { userEmail } = res.locals.User;
    const existWorkSpace = res.locals.workSpace;
    if (existWorkSpace === undefined) {
      res
        .status(404)
        .json({ success: false, message: '워크스페이스가 존재하지 않습니다.' });
    }
    if (existWorkSpace.owner === userEmail) {
      const deletedWorkSpace = await workSpace.deleteOne({ name: existWorkSpace.name });
      const deletedMembers = await member.deleteMany({
        workSpace: existWorkSpace.name,
      });
      return res.status(200).json({
        result: { deletedWorkSpace, deletedMembers },
        success: true,
        message: '워크스페이스가 삭제되었습니다.',
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: '워크스페이스 삭제 에러' });
  }
}

//전체 워크스페이스 조회
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
      .json({ success: false, message: '전체 워크스페이스 조회 실패' });
  }
}
//워크스페이스 검색
const searchWorkSpace = async (req, res, next) => {
  try {
    const { workSpaceName } = req.body;
    const existWorkSpace = await workSpace.findOne({ name: workSpaceName });
    console.log('검색 결과: ', existWorkSpace);
    if (existWorkSpace) {
      
        res.locals.workSpace = existWorkSpace;
        next();
      ;
    } else if (existWorkSpace === null) {
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
};
