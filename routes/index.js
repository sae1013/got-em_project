const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/async-handler');
const { User } = require('../models/index');
const hashPassword = require('../utils/hash-password');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', async (req,res) => {
  const newUser = await User.create({
    email:'jmw',
    name:'asdfasf',
    password:'1234',
  });
  console.log(newUser);
});

router.post('/signup',asyncHandler(async(req,res)=>{
  const {email,name,isAdmin,password} = req.body;

  // 이미 회원가입되어있을때
  const signedUpEmail = await User.findOne({
    email:email
  });
  if(signedUpEmail){
    res.status(409).send({message:'중복된 사용자 입니다'});
    return
  }
  const hashedPassword = hashPassword(password);
  await User.create({
    email,
    name,
    isAdmin,
    password:hashedPassword
  });
  
  res.status(200).send({message:'회원가입이 완료되었습니다'});
  
}));  

router.post('/logout', asyncHandler( async(req,res)=>{
  req.logout();
  await req.session.destroy(); // 세션강제삭제
  res.clearCookie('connect.sid'); //응답쿠키의 세션아이디 강제삭제
  res.status(200).send({'message':'로그아웃 되었습니다'});
}));
module.exports = router;
