const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/async-handler');
const {Product} = require('../models/index');
const adminRequired = require('../middlewares/admin-required');



module.exports = router;



// const {Schema} = require('mongoose');
// const shortId = require('./types/shortId');


// const productSchema = new Schema({
//   shortId,
//   modelName: { // 제품이름
//     type:String,
//     required:true
//   },
//   modelNumber: { //제품넘버
//     type:String,
//     required:true
//   },
//   series: { // 조던,에어포스,덩크
//     type: String,
//     default:'jordan',
//   },
//   color: { //발매색상
//     type:String
//   },
//   price: { //발매가격
//     type:Number,
//     required:true
//   },
//   releaseDate:{ // 발매날짜
//     type:Date,
//   },
//   likeCount: { //좋아요갯수
//     type:Number,
//     default: 0,
//     min:0
//   },
//   imageUrl: { //상품이미지
//     type:String,
//     required:true
//   },
//   reviews:{ // 리뷰정보
//     fit:{
//       'small':{type:Number,default:0,min:0},
//       'normal':{type:Number,default:0,min:0},
//       'big':{type:Number,default:0,min:0}
//     }, //착화감
//     feeling:{
//       'good':{type:Number,default:0,min:0},
//       'moderate':{type:Number,default:0,min:0},
//       'bad':{type:Number,default:0,min:0}
//     }, 
//     color: {
//       'clear':{type:Number,default:0,min:0},
//       'normal':{type:Number,default:0,min:0},
//       'blur':{type:Number,default:0,min:0}
//     }
//    }
// });

// module.exports = productSchema
