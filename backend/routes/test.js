const express = require('express');
const { Product, User } = require('../models/index');
const mergeState = require('../utils/merge-state');
const loginRequired = require('../middlewares/login-required');
const adminRequired = require('../middlewares/admin-required');
const passport = require('passport');
const router = express.Router();

router.post('/:productId',async (req,res)=>{
  const {productId} = req.params;
  const {reviews} = req.body
  
  const product = await Product.findOne({shortId:productId});
  let cur_reviews = product.reviews; // 사실 posts에서 가져온다음 로직돌린거를 product에 넣어줘야함.
  cur_reviews = mergeState(cur_reviews,reviews,'merge');
  console.log(cur_reviews);
  // const updatedProduct = await Product.findOneAndUpdate({shortId:productId},{reviews:updatedReviewState},{new:true});
  await product.updateOne({reviews:cur_reviews}); // 동작
  await product.deleteOne(); // 정상동작함 
// 메인로직에서 populate만 통과하면됨
  // console.log(updatedProduct);
  // res.send('ok')
  // res.json(updatedProduct)
  res.send('ok');
});

router.get('/',loginRequired,adminRequired,async (req,res)=>{
  console.log(req.user)
  res.json(req.user);
})

router.get('/second',loginRequired,async(req,res)=>{
  console.log(req.user);
})
module.exports = router;
