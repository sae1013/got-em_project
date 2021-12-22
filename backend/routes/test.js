const express = require('express');
const { Product, User } = require('../models/index');
const mergeObject = require('../utils/object-merge');
const router = express.Router();

router.post('/:productId',async (req,res)=>{
  const {productId} = req.params;
  const {reviews} = req.body
  
  const product = await Product.findOne({shortId:productId});
  const cur_reviews = product.reviews; // 사실 posts에서 가져온다음 로직돌린거를 product에 넣어줘야함.
  const updatedReviewState = mergeObject(cur_reviews,reviews);
  console.log(updatedReviewState);
  const updated = await product.update({reviews:updatedReviewState})
  console.log(updated);
  // const updatedProduct = await Product.findOneAndUpdate({shortId:productId},{reviews:updatedReviewState},{new:true});
  // console.log(updatedProduct);
  // console.log(cur_reviews)
  // console.log(reviews);
  // console.log(updatedProduct);
  res.send('ok')
  // res.json(updatedProduct)
})
module.exports = router;
