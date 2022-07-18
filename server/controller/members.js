const User = require('../schemas/user');
const workSpace = require('../schemas/workSpace');

//멤버 추가
// router.put("/workSpace/memberAdd/:workSpaceName", authMiddleware,// workSpaceController.memberAdd);
async function memberAdd(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 멤버 추가 API'
    //##swagger.description='-'
    const { workSpaceName } = req.body;
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
// router.put("/workSpace/deleteMember/:workSpaceName", authMiddleware, // workSpaceController.deleteMember);
async function deleteMember(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 멤버 삭제 API'
    //##swagger.description='-'
    const authority = res.locals.User;
    const { workSpaceName } = req.body;
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
// router.get("/workSpace/MemberList/:workSpaceName", authMiddleware, // workSpaceController.getMemberList);
async function getMemberList(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 멤버 조회 API'
    //##swagger.description='-'
    const { workSpaceName } = req.body;
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

module.exports = {
  memberAdd,
  getMemberList,
  deleteMember,
};
