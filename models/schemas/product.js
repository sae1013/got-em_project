const {Schema} = require('mongoose');
const shortId = require('./types/shortId');

const productSchema = new Schema({
  shortId,
  modelName: {
    type:String,
    // required:true
  },
  series: {
    type: String,
    default:'jordan',
  },
  color: {
    type:String
  },
  price: {
    type:Number,
    // required:true
  },
  releaseDate:{
    type:String,
    // required:true
  },
  
  likeCount: {
    type:Number,
    default: 0
  },
  image: { // 이미지 주소만 받음
    type:String,
  }
});

module.exports = productSchema