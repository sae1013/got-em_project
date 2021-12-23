const express = require("express");
const router = express.Router();
const { Post, User, Product,Comment } = require("../models");
const mergeState = require('../utils/merge-state');

const loginRequired = require("../middlewares/login-required");
 
// 게시글 전체 조회 12.23일 수정됨
router.get("/product/:productId", async (req, res) => {
  const { productId } = req.params; 
  const page = +req.query.page || 1;
  const perPage = +req.query.perPage || 10;
  const {created, view} = req.query; // 생성순, 조회순 
  let sortConfig = {notice:-1} 
  view === 'asc' ? sortConfig['viewCount']=1 : view === 'desc' ? sortConfig['viewCount']= -1:null;
  created === 'asc' ? sortConfig['createdAt'] = 1 : created === 'desc'? sortConfig['createdAt'] = -1 : null;
  
  const product = await Product.findOne({ shortId: productId });
  // 해당 제품자체를 삭제한경우, 포스팅 조회도 불가해야함.
  if(!product){
    res.send(400).json({message:'해당제품은 삭제되었습니다'});
    return
  }
  
  const total = await Post.countDocuments({ product });
  const totalPage = Math.ceil(total / perPage);

  let posts = await Post.find({product}).populate(['author','product'])
  .sort(sortConfig)
  .skip(perPage * (page - 1)) 
  .limit(perPage);
  
  res.status(200).json({page,totalData:total,totalPage,perPage,posts});

});

// 포스팅 조회 12.23일 수정됨
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  let post = await Post.findOneAndUpdate(
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

// 포스팅 작성  // 12.23일 후기부분 개발.
router.post("/write/:productId",loginRequired,async (req, res) => {
  const { productId } = req.params; // productId는 ObjectId로 ref

  const { title, content,reviews } = req.body;
  const author = await User.findOne({
    shortId: req.user.shortId,
  });
  const product = await Product.findOne({ shortId: productId });
  // product모델의 리뷰객체를 업데이트 해준다.
  let cur_reviews = product.reviews; // 수정시에는 posts에서 가져온다음 로직돌린거를 product에 넣어줘야함.
  cur_reviews = mergeState(cur_reviews,reviews,'merge');
  await product.updateOne({reviews:cur_reviews}); // 상품을 여기서 업데이트 쳐준다

  const post = await Post.create({
    product,
    title,
    content,
    author,
    notice: author.isAdmin ? true: false,
    reviews // 포스팅할때 작성한 reviews는 그대로 반환해준다.
  });
  res.status(200).json(post);
});

//포스팅 수정 
router.patch("/write/:postId",loginRequired, async (req, res) => {
  const { postId } = req.params;
  const { title, content,reviews } = req.body;

  // postId로 기존에 작성한 리뷰를 찾는다.
  const post = await Post.findOne({shortId:postId}); // 이거 product는 populate되는지 테스트
  const rollbackReviews = post.reviews;
  // 현재 타겟상품을 가져온다.
  const product = await Product.findOne({shortId:post.product.shortId});

  let cur_reviews = product.reviews;
  cur_reviews = updateState(cur_reviews,rollbackReviews,'rollback'); //롤백진행
  cur_reviews = updateState(cur_reviews,reviews,'merge'); // 병합진행
  await product.updateOne({reviews:cur_reviews}); // 리뷰교체

  const updatedPost = await Post.findOneAndUpdate(
    { shortId: postId },
    { title, content,reviews },
    { new: true }
  ).populate(['product','author']);
  res.status(200).json(updatedPost);
});

// 포스팅 삭제 
router.delete("/:postId",loginRequired, async (req, res) => {
  const { postId } = req.params;
  
  // 현재 게시글의 상품에 후기 부분 전부 롤백
  const post = await Post.findOne({shortId:postId});
  const product = await Product.findOne({shortId:post.product.shortId});
  let cur_reviews = product.reviews;
  const rollbackReviews = post.reviews;
  //롤백진행
  cur_reviews = updateState(cur_reviews,rollbackReviews,'rollback');
  await product.updateOne({reviews:cur_reviews});

  //게시글삭제
  post.deleteOne();
  res.status(200).json({ message: "게시글 삭제 완료" });
});

//댓글조회 
router.get("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ shortId: postId },"comments").populate({path:'comments.author'});
  if (!post) {
    res.status(400).json({ messaage: "게시글이 없습니다." });
    return;
  }
  res.json(post.comments);
  
});

// 댓글 추가하기 
router.post("/:postId/comments",loginRequired, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const author = await User.findOne({ shortId: req.user.shortId });
  // const author = await User.findOne({ shortId: "3" });
  const post = Post.findOne({ shortId: postId });

  if (!post) {
    res.status(400).json({ message: "게시글이 없습니다." });
    return;
  }
  const comment = await Comment.create({
    author,
    content,
  });
  // $push operator 사용하여 댓글 추가하기
  await Post.findOneAndUpdate(
    { shortId: postId },
    { $push: { comments: comment }, $inc: { commentCount: 1 } }
  );

  res.status(200).json(comment);
});


router.delete("/:postId/comments/:commentId",loginRequired, async (req, res) => {
  const { postId, commentId } = req.params;

  await Post.findOneAndUpdate(
    {
      shortId: postId,
    },
    {
      $pull: { comments: { shortId: commentId } },
      $inc: { commentCount: -1 },
    }
  );
  res.status(200).send({ message: "댓글이 삭제 되었습니다." });
});

module.exports = router;
