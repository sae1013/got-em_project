const express = require('express');
const router = express.Router();
const { Post } = require('../models/index');
const {User} = require('../models/index');
const { Product } = require('../models/index');
const asyncHandler = require('../utils/async-handler');

//단일 아이템 조회시, isLiked 추가하여 리턴
router.post('/:productId', asyncHandler(async(req, res, next) => { 
  const {productId} = req.params; 
  const product = await Product.findOne({shortId:productId});
  
    if(!req.user){
      res.status(200).json(product);
      return
    }
  const {likes} = await User.findOne({shortId:req.user.shortId}); // 먼저 사용자의 likes 배열을 가져온다
  const index = likes.indexOf(productId);
  if(index != -1){ // 이미 좋아하고있는 포스트를 찾았으면
    res.status(200).json({...product.toObject(),isLike:true});
  }else{
    res.status(200).json({...product.toObject(),isLike:false});
  }
}));

module.exports = router;
