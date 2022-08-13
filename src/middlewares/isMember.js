//클라이언트에서 API콜을 받았을때 현재 접속해있는 유저가 해당 워크스페이스의 멤버인지 아닌지를 판별하는 middleware 함수입니다.
const workSpace = require('../models/workSpace');
const Member = require('../models/member');

module.exports = async (req, res, next) => {
  try {
    const { userEmail } = res.locals.User;
    console.log(req.body.workSpaceId);
    
    const existWorkSpace = await workSpace.findById(req.body.workSpaceId);
    console.log('existWorkSpace: ', existWorkSpace);

    if (existWorkSpace === null) {
      res.status(400).send({
        success: false,
        message: '워크 스페이스가 존재하지 않습니다',
      });
      return;
    }
    const existMember = await Member.findOne({ memberEmail: userEmail });
    if (!existMember) {
      res.status(400).send({
        success: false,
        message: '본 유저는 멤버가 아닙니다.',
      });
      return;
    } else {
      
        res.locals.workSpace = existWorkSpace;
        next();
      
    }
  } catch (error) {
    console.log('member check error', error);
    res.status(400).send({
      success: false,
      message: 'isMember 체크에 실패 했습니다.',
      errorMessage: error.message,
    });
    return;
  }
};
