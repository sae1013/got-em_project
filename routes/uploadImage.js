const express = require('express');
const router = express.Router();
const upload = require('../modules/multer');
const asyncHandler = require('../utils/async-handler');
router.post('/', upload.single("image"), asyncHandler(async (req, res) => {
  // const image = req.files;
  // const path = image.map((img) => img.location);
  // if (!image) {
  //   res.status(400).json({ message: '이미지가 없습니다!' });
  // }
  if(!req.file){ // 이미지가 없을 때.
    const error = new Error('이미지 등록이 실패하였습니다.');
    throw error
  }
  res.status(200).json({ imageUrl: req.file.location });
}));

module.exports = router;


