const express = require('express');
const loginRequired = require('../middlewares/login-required');
const router = express.Router();
const { User,Product } = require('../models/index');
const asyncHandler = require('../utils/async-handler');


// 해당 유저가 좋아하고있는 상품들 모아보기
router.get('/:userId/like', asyncHandler(async (req,res)=>{
  const {userId} = req.params;
  const {likes} = await User.findOne({shortId:userId});
  const products = await Product.find({});
  let likeProducts = [];
  likes.forEach((productId)=>{
    const likeProduct = products.find((product)=> product.shortId == productId )
    if(likeProduct){
      likeProducts.push(likeProduct);
    }
  });
  res.status(200).json(likeProducts);

}));

//프로필 정보변경
router.patch('/:userId/modify', asyncHandler(async(req,res)=>{
  const {userId} = req.params;
  const {profileUrl,nickName} = req.body;
  
  const updatedUser = await User.findOneAndUpdate({shortId:userId},{profileUrl,nickName},{new:true});
  return res.status(200).json(updatedUser);
  
}));

module.exports = router;
