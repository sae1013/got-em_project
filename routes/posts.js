const express = require('express');
const router = express.Router();
const {Post} = require('../models/index');
/* GET users listing. */

router.get('/', async(req, res, next) => {
  console.log(await Post.create({title:'wwww'}));
  res.send('okok')
  
});



module.exports = router;

