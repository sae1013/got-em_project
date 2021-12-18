const { Schema } = require('mongoose');
const CommentSchema = require('./comment');
const shortId = require('./types/shortId');

const PostSchema = new Schema(
  {
    shortId,
    productId:{ 
      type:Schema.Types.ObjectId,
      ref:'Product',
      required:true,
      index:true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required:true
    },
    content: {
      type: String,
      required:true
    },
    comments: [CommentSchema],
    commentCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type:Number,
      default:0
    }
  },
  {
    timestamps: true,
  },
);

module.exports = PostSchema;
