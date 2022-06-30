const Post = require('../schemas/post');

//채용정보 등록
async function recruitpost(req, res) {
  try {
    const { user } = res.locals;
    const userid = user[0].userid;
    const companyname = user[0].companyname;
    const profileimage = user[0].profileimage;
    const intro = user[0].intro;
    const address = user[0].address;
    const country = user[0].country;
    const region = user[0].region;
    let status = true;

    // postingid 자동으로 생성되게 설정
    const maxpostingid = await Post.findOne().sort('-postingid');
    let postingid = 1;
    if (maxpostingid) {
      postingid = maxpostingid.postingid + 1;
    }

    const { thumbnail, title, maincontent, subcontent, position } = req.body;

    const recruit = await Post.create({
      postingid,
      userid,
      companyname,
      profileimage,
      intro,
      address,
      country,
      region,
      thumbnail,
      title,
      maincontent,
      subcontent,
      position,
      status,
    });
    res.status(200).send({
      success: true,
      msg: '등록이 완료되었습니다.',
    });
  } catch (err) {
    res.status(400).send('채용정보 작성 오류');
  }
}

//채용정보수정
async function recruitfixment(req, res) {
  try {
    const { postingid } = req.params;
    const { thumbnail, title, maincontent, subcontent, userimage, position } =
      req.body;
    const { user } = res.locals;
    const userid = user[0].userid;
    const list = await Post.findOne({ postingid });

    if (userid === list.userid) {
      await Post.updateOne({ postingid }, { $set: req.body });
      res.status(201).send({ success: true });
    } else {
      res.status(403).send('수정 권한이 없습니다.');
    }
  } catch {
    res.status(400).send('채용정보 수정 오류');
  }
}
//채용정보삭제
async function recruitdelete(req, res) {
  try {
    const { postingid } = req.params;
    const { user } = res.locals;
    const userid = user[0].userid;
    const list = await Post.findOne({ postingid: Number(postingid) });
    if (userid === list.userid) {
      await Post.deleteOne({ postingid: Number(postingid) });
      res.status(200).send({ success: true });
    } else {
      res.status(403).send('삭제 권한이 없습니다.');
    }
  } catch {
    res.status(400).send('채용정보 삭제 오류');
  }
}
//채용정보상태수정
async function recruitstatusfixment(req, res) {
  try {
    const { postingid } = req.params;
    const { status } = req.body;
    const { user } = res.locals;
    const userid = user[0].userid;
    const list = await Post.findOne({ postingid });

    if (userid === list.userid) {
      await Post.updateOne({ postingid }, { $set: req.body });
      res.status(201).send({ success: true });
    } else {
      res.status(403).send('상태 수정 권한이 없습니다.');
    }
  } catch {
    res.status(400).send('채용정보 수정 오류');
  }
}
//채용정보조회
async function recruitget(req, res) {
  try {
    const posts = await Post.find({ status: true }).sort({ postingid: -1 });
    const companyinfo = await CompanyUser.find(
      {},
      {
        companyname: 1,
        profileimage: 1,
        intro: 1,
        image: 1,
        address: 1,
        industry: 1,
      }
    );
    const info = {};
    info.posts = posts;
    info.companyinfo = companyinfo;
    res.send(info);
  } catch (err) {
    res.status(400).send('채용정보 조회 오류');
  }
}

module.exports = {
  recruitpost,
  recruitfixment,
  recruitdelete,
  recruitget,
  recruitstatusfixment,
};
