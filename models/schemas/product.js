const {Schema} = require('mongoose');
const shortId = require('./types/shortId');

const productSchema = new Schema({
  shortId,
  modelName: {
    type:String,
    required:true
  },
  modelNumber: { // 상품 넘버
    type:String,
    required:true
  },
  series: { // 조던,에어포스,덩크
    type: String,
    default:'jordan',
  },
  color: {
    type:String
  },
  price: {
    type:Number,
    required:true
  },
  releaseDate:{
    type:Date,
  },
  likeCount: {
    type:Number,
    default: 0
  },
  imageUrl: { 
    type:String,
    required:true
  }
});

module.exports = productSchema