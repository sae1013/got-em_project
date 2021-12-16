//테스트용 라우터

const express = require('express');
const router = express.Router();
const { Post } = require('../models/index');
const { Product } = require('../models/index');

// 좋아요 갯수 카운트 쿼리
router.get('/', (req,res)=>{
  const err = new Error('로그인 중복 발생!');
  err.status= 401
  // err.statusText="로그인 중복발생";
  throw err
  
})
router.get('/test/products', async(req,res)=>{
  try{
    const product = await Product.updateOne({shortId:1},{
      color:'blue'
    });
    console.log(product);
    res.send('ok')
  }catch(err){
    console.log(err);
  }
  
});

router.get('/test/query',async(req,res)=>{
  await Product.findOneAndUpdate({shortId:1},
    {
      $inc: {
        "reviews.size.0" : 1
      }
    })
  
    res.send('ok')
})


module.exports = router;
