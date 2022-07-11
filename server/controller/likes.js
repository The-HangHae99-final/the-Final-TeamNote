const Post = require('../schemas/post');
const Like = require('../schemas/like');

//공지 글 좋아요 등록
async function like(req, res) {
  try {
    //#swagger.tags= ['공지글 좋아요 API'];
    //#swagger.summary= '공지글 좋아요 등록 API'
    //#swagger.description='-'
    const postId = Number(req.params.postId);
    const { UserName } = res.locals.User;

    const existsPost = await Post.find({ postId });
    const aleadyLike = await Like.find({ postId });
    // let like = existsPost[0]["likes"];
    // if (UserName === aleadyLike[0].UserName) {
    //   res.status(400).send("이미 좋아요 상태입니다.");
    // } else {
    await Post.updateOne({ postId }, { $set: { likes: like + 1 } });
    await Like.create({ UserName, postId });

    res.send('좋아요 up.');
    // }
  } catch (err) {
    res.status(400).send({ message: err + ' : like failed' });
  }
}

//공지 글 좋아요 취소
async function unlike(req, res) {
  try {
    //#swagger.tags= ['공지글 좋아요 API'];
    //#swagger.summary= '공지글 좋아요 취소 API'
    //#swagger.description='-'
    const postId = Number(req.params.postId);
    const { UserName } = res.locals.user;

    const existsPost = await Post.find({ postId });
    const zeroLike = await Like.find({ postId });
    console.log('zeroLike: ', zeroLike);
    let like = existsPost[0]['likes'];

    if (!zeroLike.length) {
      res.status(400).send('좋아요를 누른 게시물이 아닙니다.');
    } else {
      await Post.updateOne({ postId }, { $set: { likes: like - 1 } });
      await Like.findOneAndDelete(
        { UserName: UserName, postId: postId },
        { UserName }
      );

      res.send('좋아요 down');
    }
  } catch (err) {
    res.status(400).send({ message: err + ' : unlike failed' });
  }
}

module.exports = {
  like,
  unlike,
};