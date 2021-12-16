const {Schema} = require('mongoose');
const shortId = require('./types/shortId');

const productSchema = new Schema({
  shortId,
  modelName: { // 제품이름
    type:String,
    required:true
  },
  modelNumber: { //제품넘버
    type:String,
    required:true
  },
  series: { // 조던,에어포스,덩크
    type: String,
    default:'jordan',
  },
  color: { //발매색상
    type:String
  },
  price: { //발매가격
    type:Number,
    required:true
  },
  releaseDate:{ // 발매날짜
    type:Date,
  },
  likeCount: { //좋아요갯수
    type:Number,
    default: 0,
    min:0
  },
  imageUrl: { //상품이미지
    type:String,
    required:true
  },
  reviews:{ // 리뷰정보
    size:{
      0:{type:Number,default:0,min:0},
      1:{type:Number,default:0,min:0},
      2:{type:Number,default:0,min:0}
    }, //착화감
    comfort:{
      0:{type:Number,default:0,min:0},
      1:{type:Number,default:0,min:0},
      2:{type:Number,default:0,min:0}
    }, 
    color: {
      0:{type:Number,default:0,min:0},
      1:{type:Number,default:0,min:0},
      2:{type:Number,default:0,min:0}
    }
   }
});

module.exports = productSchema

// reviews:{ // 리뷰정보
//   size:{type:[Number] , default:[0,0,0]}, //착화감
//   comfort:{type:[Number], default:[0,0,0]}, 
//   color: {type:[Number],default:[0,0,0]}
//  }