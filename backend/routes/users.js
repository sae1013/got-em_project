const express = require('express');
const loginRequired = require('../middlewares/login-required');
const router = express.Router();
const { User,Product,Post } = require('../models/index');
const asyncHandler = require('../utils/async-handler');
const hashPassword = require('../utils/hash-password');


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

// 유저가 작성한 글 모아보기
router.get( "/:userId/posts",loginRequired,asyncHandler(async (req, res) => {
    
    
    const page = +req.query.page || 1;
    const perPage = +req.query.perPage || 10;

    const { userId } = req.params;
    const user = await User.findOne({ shortId: userId });
    const products = await Post.find({ author: user })
      .sort({ createdAt: -1 })
      .populate(["author", "product"])
      .skip(perPage * (page - 1)) 
      .limit(perPage);
    
    const totalData = await Product.countDocuments({});

    const totalPage = Math.ceil(totalData / perPage);
    
    res.status(200).json({ page, totalData, totalPage, perPage, products });
  })
);

//프로필 정보변경
router.patch('/:userId/modify', asyncHandler(async(req,res)=>{
  const {userId} = req.params;
  const {profileUrl,nickName} = req.body;
  
  const updatedUser = await User.findOneAndUpdate({shortId:userId},{profileUrl,nickName},{new:true});
  return res.status(200).json(updatedUser);
  
}));

//비밀번호변경
router.put('/:userId/change-password',loginRequired,asyncHandler(async (req,res)=>{
  const { userId:shortId } = req.params;
  const { password } = req.body;
  const user = await User.findOne({shortId});
  user.password = hashPassword(password);
  await user.save();
  res.json({message:'비밀번호가 변경되었습니다'});

}));

module.exports = router;
