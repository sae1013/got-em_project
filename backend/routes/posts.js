const express = require("express");
const router = express.Router();
const { Post, User, Product,Comment } = require("../models");
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

//포스팅 수정 -> 완료
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
router.delete("/:postId", loginRequired, async (req, res) => {
  const { postId } = req.params;
  console.log(req.params);
  await Post.deleteOne({ shortId: postId });

  res.status(200).json({ message: "게시글 삭제 완료" });
});

//댓글조회 -> 완료
router.get("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ shortId: postId });
  if (!post) {
    res.status(400).json({ messaage: "게시글이 없습니다." });
    return;
  }
  const comments = post.comments;
  res.status(200).json(comments);
});

// 댓글 추가하기 -> 완료
router.post("/:postId/comments/write",loginRequired,async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const author = await User.findOne({ shortId: req.user.shortId });
  const post = Post.findOne({ shortId: postId });

  if (!post) {
    res.status(400).json({ message: "게시글이 없습니다." });
    return;
  }
  // populate 위해서 댓글 생성한후 삽입.
  const comment = await Comment.create({author,content});
  // $push operator 사용하여 댓글 추가하기
  await Post.findOneAndUpdate(
    {
      shortId: postId,
    },
    {
      $push: { comments: comment },
    },
  );
  res.status(200).json(comment);
});

router.delete('/:postId/comments/:commentId',async(req,res)=>{
  const {postId,commentId} = req.params;
  console.log(req.params)
  await Post.findOneAndUpdate({shortId:postId},{$pull:{comments:{shortId:commentId} }}) // [comment,comment,comment]
  
  res.status(200).send({message:'댓글이 삭제 되었습니다'});
});



module.exports = router;
