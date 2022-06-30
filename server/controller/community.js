const Message = require('../schemas/messages');

async function communitypage(req, res) {
  try {
    const { user } = res.locals;
    const username = user[0].username;
    const profileimage = user[0].profileimage;
    res.json({ username, profileimage });
  } catch (err) {
    res.status(400).send('정보 전달 오류');
  }
}

async function getchat(req, res) {
  try {
    const message = await Message.find();
    res.send(message);
  } catch (err) {
    res.status(400).send('대화내용 조회 오류');
  }
}

module.exports = {
  communitypage,
  getchat,
};
