const { Schema } = require('mongoose');
const shortId = require('./types/shortId');

const CommentSchema = new Schema(
  {
    shortId,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      default: 'asdfasdf',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = CommentSchema;
