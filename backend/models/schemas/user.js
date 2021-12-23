const { Schema } = require('mongoose');
const productSchema = require('./product');
const shortId = require('./types/shortId');

const UserSchema = new Schema(
  {
    shortId,
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      // required: true,
    },
    nickName: {
      type: String,
      // required: true,
    },
    profileUrl: {
      type:String,
    },
    password: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      // required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = UserSchema;
