const Message = require("../schemas/message");

// 메시지 수정(미완)
async function messageEdit(req, res) {
  try {
    const _id = req.params._id;
    const [existMessage] = await Message.find({ _id });
    const { user } = res.locals;
    const { message } = req.body;
    if (user.userName !== existMessage.author) {
      return res.status(401).json({ ok: false, message: "작성자가 아닙니다." });
    }
    if (!message) {
      return res.status(400).json({ ok: false, message: "빈값을 채워주세요" });
    }

    await Message.updateOne({ _id }, { $set: { message } });
    return res.status(200).json({
      result: await Message.findOne({ _id }),
      ok: true,
      message: "메시지 수정 성공",
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "메시지 수정 에러" });
  }
}
//메시지 삭제(미완)
async function messageDelete(req, res) {
  try {
    const _id = req.params._id;
    const targetMessage = await Message.find({ _id });
    console.log("targetMessage: ", targetMessage);
    const { userName } = res.locals.user;
    console.log("userName: ", userName);

    if (userName !== targetMessage.userId) {
      return res.status(401).json({
        ok: false,
        message: "작성자가 아닙니다.",
      });
    }

    await Message.deleteOne({ _id });
    return res.status(200).json({ ok: true, message: "메시지 삭제 성공" });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: "메시지 삭제 실패",
    });
  }
}
//메시지 조회
async function messagesView(req, res) {
  try {
    const _id = String(req.params._id);
    console.log("_id: ", _id);
    const targetMessage = await Message.find({ _id });
    // const messages = await Message.find({}).sort("_id");

    return res.json({
      targetMessage,
      ok: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ ok: false, message: "메시지 조회 실패" });
  }
}

module.exports = {
  messageEdit,
  messageDelete,
  messagesView,
};
