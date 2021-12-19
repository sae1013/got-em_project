const express = require("express");
const router = express.Router();
const { Post, User, Product } = require("../models");
const loginRequired = require("../middlewares/login-required");

// 해당제품모든 포스팅 조회  -> 완료
router.get("/product/:productId", async (req, res) => {
  const { productId } = req.params; // product 자체를 갖고찾는거라
  const product = await Product.findOne({ shortId: productId });
  // 해당 제품자체를 삭제한경우, 포스팅 조회도 불가해야함.
  if(!product){
    res.send(400).json({message:'해당제품은 삭제되었습니다'});
  }
  const posts = await Post.find({ product });
  res.status(200).json(posts);
});

// 포스팅 조회 -> 완료 
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOneAndUpdate(
    { shortId: postId },
    { $inc: { viewCount: 1 } },
    { new: true }
  ).populate(['product','author']); 
  if (!post) {
    res.status(400).json({ message: "해당하는 글이 없습니다." });
    return;
  }
  res.status(200).json(post);
});

// 포스팅 작성 -> 완료
router.post("/write/:productId", loginRequired, async (req, res) => {
  const { productId } = req.params; // productId는 ObjectId로 ref

  const { title, content } = req.body;
  const author = await User.findOne({
    shortId: req.user.shortId,
  });
  const product = await Product.findOne({ shortId: productId });
  const post = await Post.create({
    product,
    title,
    content,
    author,
  });
  res.status(200).json(post);
});

//포스팅 수정
router.patch("/write/:postId", loginRequired, async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  const updatedPost = await Post.findOneAndUpdate(
    { shortId: postId },
    { title, content },
    { new: true }
  ).populate(['product','author']);
  res.status(200).json(updatedPost);
});

// 포스팅 삭제 -> 완료
router.delete("/:postId/delete", loginRequired, async (req, res) => {
  const { postId } = req.params;
  await Post.deleteOne({ shortId: postId });

  res.status(200).json({ message: "글 삭제 완료" });
});

//댓글조회 -> 미완료
router.get("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ shortId: postId });
  if (!post) {
    res.status(400).json({ messaage: "게시글이 없습니다." });
    return;
  }
  await User.populate(post.comments, { path: "author" });
  res.status(200).json(post.comments);
});

// 댓글 추가하기 -> 미완료
router.post("/:postId/comments/write", async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const author = await User.findOne({ shortId: req.user.shortId });
  const post = Post.findOne({ shortId: postId });

  if (!post) {
    res.status(400).json({ message: "게시글이 없습니다." });
    return;
  }
  // $push operator 사용하여 댓글 추가하기
  await Post.updateOne(
    {
      shortId: postId,
    },
    {
      $push: { comments: { content, author } },
    }
  );

  res.status(200).json({ message: "댓글 작성 완료" });
});

module.exports = router;
