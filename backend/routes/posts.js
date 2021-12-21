const express = require("express");
const router = express.Router();
const { Post, User, Product,Comment } = require("../models");
const loginRequired = require("../middlewares/login-required");
 
// 해당제품 페이지별 포스팅 조회 posts, page, perPage, totalPage 

router.get("/product/:productId", async (req, res) => {
  const { productId } = req.params; 
  const page = +req.query.page || 1;
  const perPage = +req.query.perPage || 10;
  const {created,view} = req.query; // 생성순, 조회순
  let sortConfig = {}
  view == 'asc' ? sortConfig['viewCount']=1 : view == 'desc' ? sortConfig['viewCount']= -1:null;
  created == 'asc' ? sortConfig['createdAt'] = 1 : created == 'desc'? sortConfig['createdAt'] = -1 : null;
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
  
  posts = posts.reduce((acc,post)=>{
    if(post.author.isAdmin){
      return [...acc,{...post.toObject(),notice:true}]
    }else{
      return [...acc,{...post.toObject(),notice:false}]
    }
  },[]);
  
  res.status(200).json({page,totalData:total,totalPage,perPage,posts});

});

// 포스팅 조회 
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
  if(post.author.isAdmin){
    post = {...post.toObject(),notice:true}
  }else{
    post = {...post.toObject(),notice:false}
  }
  res.status(200).json(post);
}); 

// 포스팅 작성 
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

// 포스팅 삭제 
router.delete("/:postId", loginRequired, async (req, res) => {
  const { postId } = req.params;
  await Post.deleteOne({ shortId: postId });

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
router.post("/:postId/comments", loginRequired,async (req, res) => {
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
  
  await Post.findOneAndUpdate({shortId:postId},{$pull:{comments:{shortId:commentId} }}) // [comment,comment,comment]
  
  res.status(200).send({message:'댓글이 삭제 되었습니다'});
});



module.exports = router;
