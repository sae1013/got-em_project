const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
  console.log(req.headers.cookie);
  
  res.send('ok')
})
module.exports = router;
