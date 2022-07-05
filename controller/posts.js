const Post = require('../schemas/post');

// 글 작성하기
async function postUpload (req, res, next) {
  try {
    const { user_id } = res.locals.user;
    const { title, content, category } = req.body;
    const maxPostId = await Post.findOne().sort("-post_id");
    let post_id = 1;
    if (maxPostId) {
      post_id = maxPostId.post_id + 1;
    }
    const createdPost = await Post.create({
      post_id,
      user_id,
      title,
      content,
      category,
    });

    return res.json({ 
      result: createdPost,
      ok: true, 
      message: "게시물 작성 성공"
    });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ ok: false, message: "게시물 작성 실패" });
  }
}

// 글 전체 조회
async function postAll (req, res, next) {
  try {
    let posts;
    if (!req.query.category) {
      posts = await Post.find({}).sort("-post_id");
    } else {
      const category = req.query.category;
      posts = await Post.find({ category }).sort("-post_id");
    }
    return res.json({ 
      result: {
        count: posts.length,
        rows: posts
      },
      ok: true
    });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ ok: false, message: "게시물 조회 실패" });
  }
}

// 글 상세 조회
async function postDetail (req, res, next) {
  try {
    const post_id = Number(req.params.post_id);
    const postDetail = await Post.findOne({ post_id });
    return res.json({ 
      result: postDetail, 
      ok: true
    })
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ ok: false, message: "게시물 상세 조회 실패" });
  }
}

// 글 수정
async function postEdit(req, res, next) {
  try {
    const post_id = Number(req.params.post_id);
    const [existPost] = await Post.find({ post_id });
    const { user } = res.locals;
    const { title, category, content } = req.body;
    if (user.user_id !== existPost.user_id) {
      return res
        .status(401)
        .json({ ok: false, message: "작성자가 아닙니다." });
    }
    if (!title || !category || !content) {
      return res
        .status(400)
        .json({ ok: false, message: "빈값을 채워주세요" });
    }

    await Post.updateOne({ post_id }, { $set: { title, category, content } });
    return res.status(200).json({ 
      result: await Post.findOne({ post_id }),
      ok: true,
      message: "게시글 수정 성공"
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "게시글 수정 에러" });
  }
}

// 글 삭제 
async function postRemove(req, res, next) {
  try {
    const post_id = Number(req.params.post_id);
    const [targetPost] = await Post.find({ post_id })
    const {user_id} = res.locals.user
    
    if (user_id !== targetPost.user_id){
      return res.status(401).json({ 
        ok : false, 
        message : "작성자가 아닙니다."
      });
    }

    await Post.deleteOne({ post_id })
    return res.json({ ok : true , message : "게시글 삭제 성공"})
    
  } catch (error) {
    return res
      .status(400)
      .json({
          ok: false,
          message: "게시글 삭제 실패"
    });
  }
}

module.exports = {
  postUpload,
  postAll,
  postDetail,
  postEdit,
  postRemove
};