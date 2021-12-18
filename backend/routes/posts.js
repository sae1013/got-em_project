const express = require("express");
const router = express.Router();
const { Post, User } = require("../models");
const loginRequired = require('../middlewares/login-required');

// 모든 리뷰 조회
router.get("/", async (req, res) => {
  const posts = await Post.find({});
  res.status(200).json(posts);
});

// 리뷰 읽기(조회)
router.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;
  const post = await Post.findOne({ shortId });
  if (!post) {
    res.status(400).json({ message: "해당하는 글이 없습니다." });
    return;
  }
  post.viewCount += 1;
  await Post.updateOne({ shortId }, { viewCount: post.viewCount });
  res.status(200).json(post);
});

// 리뷰 작성 
router.post("/write",loginRequired,async (req, res) => { 
  const { title, content } = req.body;
  const {postId} = req.query;
  
  const author = await User.findOne({
    shortId: req.user.shortId,
  });

  if(postId){ // 수정모드
    const post = await Post.findOne({ shortId:postId }).populate("author");
    if (post.author.shortId !== req.user.shortId) { // 작성자와 수정자가 동일한지 확인
      res.status(400).json({ message: "작성자가 아닙니다!" });
      return
    }
    const updatedPost = await Post.findOneAndUpdate({ shortId:postId }, { title, content },{new: true});
    res.status(200).json(updatedPost);
    return
  }
  // 일반쓰기모드
  const post = await Post.create({
    title,
    content,
    author,
  });
  res.status(200).json(post);
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
