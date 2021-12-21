const express = require('express');
const router = express.Router();
const { Product, User } = require('../models/index');
const asyncHandler = require('../utils/async-handler');
const adminRequired = require('../middlewares/admin-required');
const loginRequired = require('../middlewares/login-required');

//전체 프로덕트 조회 
router.get('/',asyncHandler(async(req,res)=>{
  
  let products = await Product.find({}).sort({"likeCount":-1});
  products = products.reduce((acc,product)=>{ 
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
  res.status(200).json(products);
  
}));

// 단일 상품조회
router.get('/:productId', asyncHandler(async(req, res) => { 
  const {productId} = req.params; 
  const product = await Product.findOne({shortId:productId});
  
    if(!req.user){ // 유저 비로그인 시, 
      res.status(200).json({...product.toObject(),isLike:false});
      return
    }
  const {likes} = await User.findOne({shortId:req.user.shortId}); //먼저 사용자의 likes 배열을 가져온다
  const index = likes.indexOf(productId);
  if(index != -1){ // 이미 좋아하고있는 상품이라면
    res.status(200).json({...product.toObject(),isLike:true});
  }else{
    res.status(200).json({...product.toObject(),isLike:false});
  }
}));

//좋아요기능
router.get('/:productId/like',loginRequired,asyncHandler(async(req,res)=>{
  const {productId} = req.params;
  
  const {likes} = await User.findOne({shortId:req.user.shortId});
  const index = likes.indexOf(productId);
  if(index != -1){ // 이미 좋아하고 있는 프로덕트라면,좋아요취소 cnt감소, user에 빼내줌
    const product = await Product.findOneAndUpdate({shortId:productId},{$inc:{likeCount:-1}},{new:true}); 
    await User.findOneAndUpdate({shortId:req.user.shortId},{$pull: {likes : productId}});
    res.status(200).json({...product.toObject(),isLike:false});
  
  }else { // 좋아요 처리 cnt증가 , like배열에 추가해줌
    const product = await Product.findOneAndUpdate({shortId:productId},{$inc:{likeCount:1}},{new:true} ); 
    await User.findOneAndUpdate({shortId:req.user.shortId},{$push: {likes : productId}});
    res.status(200).json({...product.toObject(),isLike:true});
  }
}));


//어드민 상품등록, 
router.post('/enroll',adminRequired,asyncHandler(async(req,res)=>{
  const productId = Object.keys(req.query)[0];
  const {modelName,modelNumber,series,color,price,releaseDate,imageUrl} = req.body;
  const adminUser = await User.findOne({shortId:req.user.shortId});
  
  if(productId){ 
    const existingProduct = await Product.findOne({shortId: productId}).populate('author');
    if(existingProduct.author.shortId != adminUser.shortId){ // 글작성자와 다른유저가 수정한경우
      const error = new Error('작성자와 달라 권한이 없습니다');
      error.status = 401;
      throw error 
    } 
    const updatedProduct = await Product.findOneAndUpdate({shortId:productId},{modelName,modelNumber,series,color,price,releaseDate,imageUrl},{new: true}).populate('author');
    res.status(200).json(updatedProduct);
    return
  }
  //상품 등록
  const enrolledProduct = await Product.create({modelName,modelNumber,series,color,price,releaseDate,imageUrl,author:adminUser});
  res.status(200).json(enrolledProduct); 

}));

//해당 어드민이 등록한 상품 모아보기. 
router.get('/admin/:adminId', asyncHandler(async(req,res)=>{
  console.log(req.user);
  const {adminId} = req.params;
  const adminUser = await User.findOne({shortId:adminId});
  const products = await Product.find({author:adminUser});
  res.status(200).json(products);
}));

module.exports = router;
