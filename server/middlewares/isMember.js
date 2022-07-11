//클라이언트에서 API콜을 받았을때 현재 접속해있는 유저가 해당 워크스페이스의 멤버인지 아닌지를 판별하는 middleware 함수입니다.
const workSpace = require('../schemas/workSpace');

module.exports = async (req, res, next) => {
  try {
    const { workSpaceName } = req.params;
    console.log('workSpaceName: ', workSpaceName);
    const userEmail = res.locals.User.userEmail;
    console.log('userEmail: ', userEmail);
    const existWorkSpace = await workSpace.findOne({ name: workSpaceName });
    console.log('existWorkSpace: ', existWorkSpace);

    if (existWorkSpace === null) {
      res.status(400).send({
        ok: false,
        errorMessage: '해당 워크 스페이스는 존재하지 않습니다',
      });
      return;
    }
    const existMember = existWorkSpace.memberList.filter(
      (memberInfo) => memberInfo.memberEmail === userEmail
    );
    if (!existMember.length) {
      res.status(400).send({
        ok: false,
        errorMessage: '본 유저는 멤버가 아닙니다.',
      });
      return;
    }
    next();
  } catch (error) {
    console.log('member check error', error);
    res.status(400).send({
      ok: false,
      errorMessage: '서버에러: isMember 체크 실패',
    });
    return;
  }
};
