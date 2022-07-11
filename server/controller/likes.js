const Post = require("../schemas/post");
const Like = require("../schemas/like");

//좋아요
async function like(req, res) {
  try {
    const postId = Number(req.params.postId);
    const { userEmail } = res.locals.User;

    const existsPost = await Post.find({ postId });
    const aleadyLike = await Like.find({ postId });
    // let like = existsPost[0]["likes"];
    // if (userEmail === aleadyLike[0].userEmail) {
    //   res.status(400).send("이미 좋아요 상태입니다.");
    // } else {
      await Post.updateOne({ postId }, { $set: { likes: like + 1 } });
      await Like.create({ userEmail, postId });

      res.send("좋아요 up.");
    // }
  } catch (err) {
    res.status(400).send({ message: err + " : like failed" });
  }
}

//좋아요 취소
async function unlike(req, res) {
  try {
    const postId = Number(req.params.postId);
    const { userEmail } = res.locals.User;

    const existsPost = await Post.find({ postId });
    const zeroLike = await Like.find({ postId });
    console.log('zeroLike: ', zeroLike);
    let like = existsPost[0]["likes"];
    
    if (!zeroLike.length) {
      res.status(400).send("좋아요를 누른 게시물이 아닙니다.");
    } else {
      await Post.updateOne({ postId }, { $set: { likes: like - 1 } });
      await Like.findOneAndDelete(
        { userEmail: userEmail, postId: postId },
        { userEmail }
      );

      res.send("좋아요 down");
    }
  } catch (err) {
    res.status(400).send({ message: err + " : unlike failed" });
  }
}

module.exports = {
  like,
  unlike,
};
