const express = require("express");
const router = express.Router();
const { Post, User, Product } = require("../models");
const loginRequired = require("../middlewares/login-required");

// 해당제품모든 포스팅 조회  -> 완료
router.get("/product/:productId", async (req, res) => {
  const { productId } = req.params; // product 자체를 갖고찾는거라
  const product = await Product.findOne({ shortId: productId });
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

module.exports = router;
