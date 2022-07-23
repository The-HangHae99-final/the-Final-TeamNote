const User = require("../schemas/user");
const workSpace = require("../schemas/workSpace");
const Inviting = require("../schemas/inviting");
const { createIndexes } = require("../schemas/user");

//멤버 추가
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
        .json({ success: false, message: "존재하지 않는 유저입니다." });
    } else if (existMember.length) {
      return res
        .status(400)
        .json({ of: false, message: "이미 포함된 유저입니다." });
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
        message: "멤버 추가 성공",
      });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: "멤버 추가 에러" });
  }
}
//멤버 삭제
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
    console.log("existMember: ", existMember);
    if (userEmail !== myWorkSpace.owner) {
      return res
        .status(400)
        .json({ success: false, message: "오너만 멤버를 삭제할 수 있습니다." });
    } else if (!existMember.length) {
      return res
        .status(400)
        .json({ success: false, message: "해당 멤버가 없습니다." });
    } else {
      const filtered = myWorkSpace.memberList.filter(
        (memberInfo) => memberInfo.memberEmail !== memberEmail
      );
      await workSpace.updateOne(
        { name: workSpaceName },
        { $set: { memberList: filtered } }
      );
      console.log("filtered: ", filtered);

      return res.status(200).json({
        success: true,
        message: "멤버 삭제 성공",
      });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: "멤버 삭제 에러" });
  }
}
//멤버 목록 조회
async function getMemberList(req, res) {
  try {
    //#swagger.tags= ['워크 스페이스 API'];
    //#swagger.summary= '워크 스페이스 멤버 조회 API'
    //##swagger.description='-'
    const { workSpaceName } = req.params;
    const existWorkSpace = await workSpace.findOne({ name: workSpaceName });
    console.log("existWorkSpace: ", existWorkSpace);
    const memberList = existWorkSpace.memberList;
    return res.status(200).json({
      result: memberList,
      success: true,
      message: "목록 조회 성공",
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "멤버 목록 조회 에러" });
  }
}

//멤버 초대
async function inviteMemberWEB(req, res) {
  try {
    const { userEmail, workSpaceName } = req.body;
    const existUser = await User.findOne({ userEmail });

    if (!existUser) {
      return res
        .status(404)
        .json({ success: false, message: "존재하지 않는 유저입니다." });
    }
    if (existUser) {
      const invitedUser = await Inviting.create({ userEmail, workSpaceName });
      return res.status(201).json({
        result: invitedUser,
        success: true,
        message: `${userEmail}를 초대하였습니다.`,
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "초대에 실패하였습니다." });
  }
}

//초대 조회
async function showInviting(req, res) {
  try {
    const { userEmail } = req.params;
  
    const invitedUser = await Inviting.findOne({userEmail});
    console.log('invitedUser: ', invitedUser);
  
    if (invitedUser) {
      return res.status(200).json({ result: invitedUser.workSpaceName, success: true, message: "초대 조회 성공" });
    }
    if (!invitedUser) {
      return res
        .status(404)
        .json({ success: false, message: "초대 내역에 없습니다." });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "초대 조회에 실패하였습니다." });
  }
}
//초대 수락
async function acceptInviting(req, res){
  try {
    const { workSpaceName, userEmail } = req.body;
    const [myWorkSpace] = await workSpace.find({ name: workSpaceName });
    const existUser = await User.findOne({ userEmail: userEmail });

    const existMember = myWorkSpace.memberList.filter(
      (memberInfo) => memberInfo.memberEmail === userEmail
    ); //멤버리스트 내 존재 유무 확인

    if (existMember.length) {
      return res
        .status(400)
        .json({ of: false, message: "이미 포함된 유저입니다." });
    } else {
      myWorkSpace.memberList.push({
        memberEmail: existUser.userEmail,
        memberName: existUser.userName,
      });
      await workSpace.updateOne(
        { name: workSpaceName },
        { $set: { memberList: myWorkSpace.memberList } }
      );
      await Inviting.deleteOne({userEmail})

      return res.status(200).json({
        result: myWorkSpace,
        success: true,
        message: "멤버 초대 성공",
      });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: "멤버 초대 에러" });
  }
}

async function refuseInviting(req, res){
  try {
    const { userEmail } = req.body;
    await Inviting.deleteOne({userEmail})
    res.status(200).json({
      success: true,
      message: "초대 거절 성공",
    })
  } catch (err) {
    return res.status(400).json({ success: false, message: "초대 거절에 실패하였습니다." });
  }
  

}

// // 회원가입 - 인증코드 이메일로 보내기 - 보류
// async function inviteMember(req, res) {
//   //#swagger.tags= [' 인증코드 메일링 API'];
//   //#swagger.summary= '인증코드 메일링 API'
//   //#swagger.description='-'

//   min = Math.ceil(111111);
//   max = Math.floor(999999);
//   const number = Math.floor(Math.random() * (max - min)) + min;
//   const { userEmail } = req.body;

//   // 메일 옵션
//   let mailOptions = {
//     from: "hanghae99@naver.com", // 메일 발신자
//     to: userEmail, // 메일 수신자

//     // 회원가입 완료하고 축하 메시지 전송할 시
//     // to: req.body.userid
//     subject: `고객님의 팀노트 회원가입을 축하합니다.`, // 메일 제목
//     html: `<h2>고객님의 팀 협업 행복을 응원합니다.</h2>
//           <br/>
//           <p>협업, 일정등록부터 커리어 성장, 사이드 프로젝트까지!</p>
//           <p>팀노트 200% 활용법을 확인해 보세요.</p>
//           <p> 워크 스페이스 가입을 위해 옆의 숫자를 입력해주세요.--- ${number} ---</p>
//           <p><img src= 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK0SAoLYOpmnAffwHHWCELREMb2jmrNKAlbA&usqp=CAU'width=400, height=200/></p>`,
//   };
//   // 메일 발송
//   transporter.sendMail(mailOptions, function (err, success) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("이메일이 성공적으로 발송되었습니다!");
//     }
//   });
//   res.send({ number: number }); //인증번호 인증기능.
// }

module.exports = {
  addMember,
  getMemberList,
  deleteMember,
  // inviteMember,
  inviteMemberWEB,
  acceptInviting,
  refuseInviting,
  showInviting
};
