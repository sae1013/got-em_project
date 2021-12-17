//테스트용 라우터 이라우터는 완전 연습용입니다.

const express = require('express');
const router = express.Router();
const { Post } = require('../models/index');
const { Product } = require('../models/index');

// 좋아요 갯수 카운트 쿼리
router.post('/', (req,res)=>{
  console.log(req.body);
  res.send('ok');
  
});

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
