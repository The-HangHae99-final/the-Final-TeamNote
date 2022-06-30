const Mypage = require('../schemas/mypage');
const Post = require('../schemas/post');

async function bookmark(req, res) {
  try {
    const { postingid } = req.params;

    const { user } = res.locals;
    const userid = user[0].userid;
    console.log('userid: ', userid);

    const [markList] = await Post.find(
      { postingid },
      {
        postingid: 1,
        userid: 1,
        profileimage: 1,
        companyname: 1,
        maincontent: 1,
        title: 1,
        thumbnail: 1,
        subcontent: 1,
        position: 1,
        intro: 1,
        address: 1,
        status: 1,
        _id: 0,
      }
    );
    let temp = 0;
    const existsmarks = await Mypage.find();

    for (let i = 0; i < existsmarks.length; i++) {
      if (existsmarks[i].markList[0].postingid === Number(postingid)) {
        temp = 1;
      }
    }
    if (temp === 1) {
      await Mypage.deleteOne({ postingid: Number(postingid) });
      res.send('북마크 off');
    } else {
      await Mypage.create({
        userid,
        markList,
      });
      res.send('북마크 on');
    }
  } catch (err) {
    res.status(400).send('마크 오류');
  }
}

async function mypage(req, res) {
  try {
    const { user } = res.locals;
    const userId = user[0].userid;

    const marks = await Mypage.find({ userId }).sort({ postingid: -1 });
    res.json(marks);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: '마이페이지 조회 오류',
    });
  }
}

module.exports = {
  bookmark,
  mypage,
};
