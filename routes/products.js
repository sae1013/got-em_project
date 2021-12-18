const express = require('express');
const router = express.Router();
const { Product, User } = require('../models/index');
const asyncHandler = require('../utils/async-handler');
const adminRequired = require('../middlewares/admin-required');
const loginRequired = require('../middlewares/login-required');

//전체 프로덕트 조회 
router.get('/',asyncHandler(async(req,res)=>{
  //로그인시, 비로그인시 나눠서 
  let products = await Product.find({}).sort({"likeCount":-1});
  products = products.reduce((acc,product)=>{ // 좋아요 flag박아서 리턴
    return [...acc,{...product.toObject(),isLike:false}]
  },[]);

  if(!req.user){
    res.status(200).json(products);
    return
  }
  const {likes} = await User.findOne({shortId:req.user.shortId});
  products.forEach((product)=>{
    if(likes.indexOf(product.shortId) != -1){
      product.isLike = true;
    }
  })
  console.log(products);
  res.status(200).json(products);
  
}));

// 단일 프로덕트 조회 단일 아이템 조회시, isLiked 추가하여 리턴
router.get('/:productId', asyncHandler(async(req, res) => { 
  const {productId} = req.params; 
  const product = await Product.findOne({shortId:productId});
  
    if(!req.user){ // 유저 비로그인 시, 
      res.status(200).json({...product.toObject(),isLike:false});
      return
    }
  const {likes} = await User.findOne({shortId:req.user.shortId}); // 먼저 사용자의 likes 배열을 가져온다
  const index = likes.indexOf(productId);
  if(index != -1){ // 이미 좋아하고있는 프로덕트라면
    res.status(200).json({...product.toObject(),isLike:true});
  }else{
    res.status(200).json({...product.toObject(),isLike:false});
  }
}));
// 좋아요 클릭시, 해당 아이템이 좋아요 목록에 있다면? 삭제하고,-1 감소시키기. 
// 해당아이템이 좋아요 목록에 없다면? 배열에 추가하고 +1 증가시키기
router.get('/:productId/like',loginRequired,asyncHandler(async(req,res)=>{
  const {productId} = req.params;
  
  const {likes} = await User.findOne({shortId:req.user.shortId});
  const index = likes.indexOf(productId);
  if(index != -1){ // 이미 좋아하고 있는 프로덕트라면,좋아요취소 cnt감소, user에 빼내줌
    const product = await Product.findOneAndUpdate({shortId:productId},{$inc:{likeCount:-1}}); 
    await User.findOneAndUpdate({shortId:req.user.shortId},{$pull: {likes : productId}});
    res.status(200).json({...product.toObject(),isLike:false,likeCount:product.likeCount-1});
  
  }else { // 좋아요 처리 cnt증가 , like배열에 추가해줌
    const product = await Product.findOneAndUpdate({shortId:productId},{$inc:{likeCount:1}}); 
    await User.findOneAndUpdate({shortId:req.user.shortId},{$push: {likes : productId}});
    res.status(200).json({...product.toObject(),isLike:true,likeCount:product.likeCount+1});
  }
}));

//어드민 상품등록, 수정
router.post('/enroll',adminRequired,asyncHandler(async(req,res)=>{
  const {edit,productId} = req.query;
  const {modelName,modelNumber,series,color,price,releaseDate,productImageUrl} = req.body;
  const adminUser = await User.findOne({shortId:req.user.shortId});
  
  if(edit && productId){ // 상품 업데이트, edit=true 와, 상품ID가 있어야함, 등록된 상품을 업데이트하고 
    const existingProduct = await Product.findOne({shortId: productId}).populate('author');
    if(existingProduct.author.shortId != adminUser.shortId){ // 글작성자와 다른유저가 수정한경우
      const error = new Error('작성자와 달라 권한이 없습니다');
      error.status = 401;
      throw error 
    }
    const updatedProduct = await Product.findOneAndUpdate({shortId:productId},{modelName,modelNumber,series,color,price,releaseDate,productImageUrl});  
    res.status(200).json(updatedProduct);
    return
  }
  //상품 등록
  const enrolledProduct = await Product.create({modelName,modelNumber,series,color,price,releaseDate,productImageUrl,author:adminUser});
  res.status(200).json(enrolledProduct); // 글쓴이까지 포함해서 populate 한상태로 내려주어야함,

}));

module.exports = router;
