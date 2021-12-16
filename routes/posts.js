const express = require('express');
const router = express.Router();
const { Post } = require('../models/index');

router.get('/', async (req, res, next) => {
  const post = await Post.create({ title: 'wwww' });
  res.status(200).json(post);
});

module.exports = router;
