
const Message = require("../schemas/message");
const workSpace = require("../schemas/workSpace")



// 메시지 수정
// api/message/:_id
async function messageEdit(req, res) {
  try {
    //#swagger.tags= ['메세지 API'];
    //#swagger.summary= '메세지 수정 API'
    //#swagger.description='-'
    const { _id } = req.params;
    const [existMessage] = await Message.findById(_id);
    const { userName } = res.locals.User;
    const { message } = req.body;
<<<<<<< HEAD
=======
<<<<<<< HEAD
    if (user.userName !== existMessage.author) {
=======

>>>>>>> be9920c38a26e3ecfe235aac71da24ceccac32a7
    if (userName !== existMessage.author) {
>>>>>>> 2339f255f2b4994103d096c2efadd3892262b15f
      return res
        .status(401)
        .json({ success: false, message: '작성자가 아닙니다.' });
    }
    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: '빈값을 채워주세요' });
    }

    const editedMessage = await Message.updateOne(
      { _id },
      { $set: { message } }
    );
    return res.status(200).json({
      result: editedMessage,
      success: true,
      message: '메시지 수정 성공',
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: '메시지 수정 에러' });
  }
}
//메시지 삭제
// api/message/:_id
async function messageDelete(req, res) {
  try {
    //#swagger.tags= ['메세지 API'];
    //#swagger.summary= '메세지 삭제 API'
    //#swagger.description='-'
    const { _id } = req.params;
    const author = res.locals.User.userName;

    const targetMessage = await Message.findById(_id);

    if (!targetMessage.length) {
      return res.status(400).json({
        success: false,
        message: '해당 메시지가 존재하지 않습니다.',
      });
    } else if (targetMessage[0].author !== author) {
      return res.status(400).json({
        ok: false,
        message: "본인만 삭제 가능 합니다.",
      });
    }

    await Message.Delete(_id);
    return res.status(200).json({ ok: true, message: "메시지 삭제 성공" });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: '메시지 삭제 실패',
    });
  }
}
//메시지 조회
// api/message/:_id
async function messagesView(req, res) {
  try {
    //#swagger.tags= ['메세지 API'];
    //#swagger.summary= '메세지 조회 API'
    //#swagger.description='-'
    const { _id } = req.params;

    const targetMessage = await Message.findById(_id);

    return res.json({
      targetMessage,
      ok: true,
    });
  } catch (err) {
    console.error(err);
<<<<<<< HEAD
    return res.status(400).json({ ok: false, message: "메시지 조회 실패" });
=======
<<<<<<< HEAD
    return res
      .status(400)
      .json({ success: false, message: '메시지 조회 실패' });
=======

    return res.status(400).json({ ok: false, message: '메시지 조회 실패' });
>>>>>>> 2339f255f2b4994103d096c2efadd3892262b15f
>>>>>>> be9920c38a26e3ecfe235aac71da24ceccac32a7
  }
}


<<<<<<< HEAD
    const existWorkSpace = await workSpace.findOne({ name: workSpaceName });
    for (let i = 0; i < existWorkSpace.memberList.length; i++) {
      if (existWorkSpace.memberList[i].memberName === opponent) {
        const roomId = [userName, opponent];
        roomId.sort();

        return res.status(200).json({
          result: roomId[0] + roomId[1],

          success: true,
          message: '룸 이름 얻기 성공',
        });
      }
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: ' 에러싫어에러' });
  }
}
=======
>>>>>>> 2339f255f2b4994103d096c2efadd3892262b15f
module.exports = {
  messageEdit,
  messageDelete,
  messagesView,
};
