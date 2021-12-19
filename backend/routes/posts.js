const express = require("express");
const router = express.Router();
const { Post, User } = require("../models");
const loginRequired = require('../middlewares/login-required');

// 모든 리뷰 조회 1. 
router.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  const posts = await Post.find({ productId });
  res.status(200).json(posts);
});

// 리뷰 읽기(조회)
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOneAndUpdate(
    { shortId: postId },
    { $inc: { viewCount: 1 } },
    { returnOriginal: false }
  );
  //const post = await Post.findOne({});

  if (!post) {
    res.status(400).json({ message: "해당하는 글이 없습니다." });
    return;
  }
  res.status(200).json(post);
});


// 리뷰 읽기(조회) 
router.post("/write/:productId",loginRequired,async (req, res) => {
  const { productId } = req.params;
  const {} = req.query;
  const { title, content } = req.body;
  const author = await User.findOne({
    shortId: req.user.shortId,
  });
  if (!author) {
    res.status(400).json({ message: "로그인을 하지 않았습니다." });
  }
  await Post.create({
    productId,
    title,
    content,
    author,
  });
  res.status(200).json({ message: "글 작성 완료" });
});


// 리뷰 삭제
router.delete("/:postId/delete",loginRequired, async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ postId }).populate("author");
  if (post.author.shortId !== req.user.shortId) {
    res.status(400).json({ message: "작성자가 아닙니다!" });
    return;
  }
  await Post.deleteOne({ shortId:postId });

  res.status(200).json({ message: "글 삭제 완료" });
});

router.get("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ shortId:postId });
  if (!post) {
    res.status(400).json({ messaage: "게시글이 없습니다." });
    return;
  }
  await User.populate(post.comments, { path: "author" });
  res.status(200).json(post.comments);
});

router.post("/:postId/comments/write", async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const author = await User.findOne({ shortId: req.user.shortId });
  const post = Post.findOne({ shortId:postId });

  if (!post) {
    res.status(400).json({ message: "게시글이 없습니다." });
    return;
  }
  // $push operator 사용하여 댓글 추가하기
  await Post.updateOne(
    {
      shortId:postId,
    },
    {
      $push: { comments: { content, author } },
    }
  );

  res.status(200).json({ message: "댓글 작성 완료" });
});

module.exports = router;
