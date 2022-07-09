const User = require('../schemas/user');
const workSpace = require('../schemas/workSpace');

//워크스페이스 생성
async function create(req, res) {
  try {
    const owner = res.locals.user;
    const { name } = req.body;
    const existName = await workSpace.find({ name });

    if (existName.length) {
      if (existName[0].owner === owner.UserName)
        return res
          .status(400)
          .send({ errorMessage: '이미 존재하는 이름입니다.' });
    } else {
      const createdWorkSpace = await workSpace.create({
        owner: owner.UserName,
        name,
      });

      createdWorkSpace.memberList.push({
        memberId: owner.UserName,
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
async function memberAdd(req, res) {
  try {
    const owner = res.locals.user.UserName;
    const { workSpaceName } = req.params;
    const { UserName } = req.body;

    const [myWorkSpace] = await workSpace.find({ name: workSpaceName });
    const existCheck = await User.findOne({ UserName: UserName });
    const existMember = myWorkSpace.memberList.filter(
      (memberInfo) => memberInfo.memberId === UserName
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
        memberId: existCheck.UserName,
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
async function deleteMember(req, res) {
  try {
    const authority = res.locals.user;
    console.log('authority: ', authority);
    const { workSpaceName } = req.params;
    const { memberId } = req.body;
    const myWorkSpace = await workSpace.findOne({ workSpaceName });
    const existMember = myWorkSpace.memberList.filter(
      (memberInfo) => memberInfo.memberId === memberId
    );
    if (authority.UserName !== myWorkSpace.owner) {
      return res
        .status(400)
        .json({ ok: false, message: '오너만 멤버를 삭제할 수 있습니다.' });
    } else if (!existMember.length) {
      return res
        .status(400)
        .json({ ok: false, message: '해당 멤버가 없습니다.' });
    } else {
      const filtered = myWorkSpace.memberList.filter(
        (memberInfo) => memberInfo.memberId !== memberId
      );
      await workSpace.updateOne(
        { memberId },
        { $set: { memberList: filtered } }
      );

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
async function getMemberList(req, res) {
  try {
    const { workSpaceName } = req.params;
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

//방 이름 건네주기
async function roomName(req, res) {
  try {
    const me = res.locals.user.userName;
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

module.exports = {
  create,
  memberAdd,
  roomName,
  getMemberList,
  deleteMember,
};
