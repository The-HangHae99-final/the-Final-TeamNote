const workSpace = require('../schemas/workSpace');

//워크스페이스 생성
// router.post('/workSpace', authMiddleware, workSpaceController.createSpace);
async function createSpace(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 생성 API'
    //##swagger.description='-'
    const user = res.locals.User;
    const { name } = req.body;
    const workSpaceName = `${user.userEmail}+${name}`; //만든이가 다른경우 워크스페이스 이름 중복가능을 위함
    const memberList = [];
    memberList.push({ memberEmail: user.userEmail, memberName: user.userName }); //만든 사람 멤버리스트에 집어넣기
    const existName = await workSpace.find({ name: workSpaceName });

    if (existName.length) {
      if (existName[0].owner === user.userEmail)
        return res
          .status(400)
          .send({ errorMessage: '이미 존재하는 이름입니다.' });
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
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
      error,
    });
  }
}

//워크스페이스 탈퇴하기
// router.put('/workSpace/leave',authMiddleware,isMember,workSpaceController.workSpaceLeave);
async function workSpaceLeave(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 탈퇴 API'
    //##swagger.description='-'
    const { userEmail } = res.locals.User;
    const { workSpaceName } = req.body;
    const targetWorkSpace = await workSpace.findOne({ name: workSpaceName });

    if (targetWorkSpace.owner === userEmail) {
      return res.status(400).json({
        success: false,
        message:
          '본인이 만든 워크스페이스는 탈퇴할 수 없습니다.(단, 삭제 가능)',
      });
    }

    const excepted = targetWorkSpace.memberList.filter(
      (memberInfo) => memberInfo.memberEmail !== userEmail
    );

    await workSpace.updateOne(
      { name: workSpaceName },
      { $set: { memberList: excepted } }
    );
    return res.status(200).json({ success: true, message: '탈퇴 성공' });
  } catch (err) {
    return res.status(400).json({ success: false, message: '탈퇴 에러' });
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
    const { workSpaceName } = req.body;
    const targetWorkSpace = await workSpace.findOne({ name: workSpaceName });

    if (targetWorkSpace.owner === userEmail) {
      await workSpace.deleteOne({ name: workSpaceName });
      return res
        .status(200)
        .json({ success: true, message: '워크스페이스가 삭제되었습니다.' });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: '워크스페이스 삭제 에러' });
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
    const includedList = [];

    workSpaceList.map((Info) =>
      Info.memberList.map((member) =>
        member.memberEmail === userEmail ? includedList.push(Info) : null
      )
    );
    return res.status(200).json({
      includedList,
      success: true,
      message: '워크스페이스 목록 조회 성공',
    });
  } catch (err) {
    return res
      .status(400)

      .json({ success: false, message: '소속 워크스페이스 목록 조회 실패' });
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
async function getWorkSpaceByName(req, res, next) {
  try {
    const workSpaceName = req.body;
    const existWorkSpace = await workSpace.findOne(workSpaceName);
    if (existWorkSpace) {
      res.status(200).json(existWorkSpace);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    return res
      .status(400)

      .json({ success: false, message: '워크스페이스 검색 실패' });
  }
}

// 회원가입 - 인증코드 이메일로 보내기 - 보류
// router.post('/users/mailing', userController.mailing);
async function workInviting(req, res) {
  //#swagger.tags= [' 인증코드 메일링 API'];
  //#swagger.summary= '인증코드 메일링 API'
  //#swagger.description='-'

  min = Math.ceil(111111);
  max = Math.floor(999999);
  const number = Math.floor(Math.random() * (max - min)) + min;
  const { userEmail } = req.body;

  // 메일 옵션
  let mailOptions = {
    from: 'hanghae99@naver.com', // 메일 발신자
    to: userEmail, // 메일 수신자

    // 회원가입 완료하고 축하 메시지 전송할 시
    // to: req.body.userid
    subject: `고객님의 팀노트 회원가입을 축하합니다.`, // 메일 제목
    html: `<h2>고객님의 팀 협업 행복을 응원합니다.</h2>
          <br/>
          <p>협업, 일정등록부터 커리어 성장, 사이드 프로젝트까지!</p>
          <p>팀노트 200% 활용법을 확인해 보세요.</p>
          <p> 워크 스페이스 가입을 위해 옆의 숫자를 입력해주세요.--- ${number} ---</p>
          <p><img src= 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK0SAoLYOpmnAffwHHWCELREMb2jmrNKAlbA&usqp=CAU'width=400, height=200/></p>`,
  };
  // 메일 발송
  transporter.sendMail(mailOptions, function (err, success) {
    if (err) {
      console.log(err);
    } else {
      console.log('이메일이 성공적으로 발송되었습니다!');
    }
  });
  res.send({ number: number }); //인증번호 인증기능.
}

module.exports = {
  createSpace,
  workSpaceLeave,
  deleteWorkSpace,
  getWorkSpaceList,
  everyWorkSpace,
  getWorkSpaceByName,
  workInviting,
};
