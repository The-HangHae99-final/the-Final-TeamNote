const User = require('../schemas/user');
const workSpace = require('../schemas/workSpace');

//멤버 추가
// router.put("/memberIn", authMiddleware,isMember, workSpaceController.addMember);
async function addMember(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 멤버 추가 API'
    //##swagger.description='-'
    const { workSpaceName, userEmail } = req.body;
    const [myWorkSpace] = await workSpace.find({ name: workSpaceName });
    const existUser = await User.findOne({ userEmail: userEmail });

    const existMember = myWorkSpace.memberList.filter(
      (memberInfo) => memberInfo.memberEmail === userEmail
    ); //멤버리스트 내 존재 유무 확인

    if (!existUser) {
      return res
        .status(400)
        .json({ success: false, message: '존재하지 않는 유저입니다.' });
    } else if (existMember.length) {
      return res
        .status(400)
        .json({ of: false, message: '이미 포함된 유저입니다.' });
    } else {
      myWorkSpace.memberList.push({
        memberEmail: existUser.userEmail,
        memberName: existUser.userName,
      });
      await workSpace.updateOne(
        { name: workSpaceName },
        { $set: { memberList: myWorkSpace.memberList } }
      );

      return res.status(200).json({
        result: myWorkSpace,
        success: true,
        message: '멤버 추가 성공',
      });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: '멤버 추가 에러' });
  }
}
//멤버 삭제
// router.put("/workSpace/deleteMember/:workSpaceName", authMiddleware, // workSpaceController.deleteMember);
async function deleteMember(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 멤버 삭제 API'
    //##swagger.description='-'
    const { userEmail } = res.locals.User;
    const { workSpaceName, memberEmail } = req.body;
    const myWorkSpace = await workSpace.findOne({ name: workSpaceName });
    const existMember = myWorkSpace.memberList.filter(
      (memberInfo) => memberInfo.memberEmail === memberEmail
    );
    console.log('existMember: ', existMember);
    if (userEmail !== myWorkSpace.owner) {
      return res
        .status(400)
        .json({ success: false, message: '오너만 멤버를 삭제할 수 있습니다.' });
    } else if (!existMember.length) {
      return res
        .status(400)
        .json({ success: false, message: '해당 멤버가 없습니다.' });
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
        success: true,
        message: '멤버 삭제 성공',
      });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: '멤버 삭제 에러' });
  }
}
//멤버 목록 조회
// router.get("/member",authMiddleware,isMember,memberController.getMemberList);
async function getMemberList(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 멤버 조회 API'
    //##swagger.description='-'
    const { workSpaceName } = req.params;
    const existWorkSpace = await workSpace.findOne({ name: workSpaceName });
    console.log('existWorkSpace: ', existWorkSpace);
    const memberList = existWorkSpace.memberList;
    return res.status(200).json({
<<<<<<< HEAD
      result: memberList,
=======
      result: memberList.memberList,
>>>>>>> be9920c38a26e3ecfe235aac71da24ceccac32a7
      success: true,
      message: '목록 조회 성공',
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: '멤버 목록 조회 에러' });
  }
}

module.exports = {
  addMember,
  getMemberList,
  deleteMember,
};
