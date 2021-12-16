const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/async-handler');
const hashPassword = require('../utils/hash-password');
const sendMail = require('../utils/node-mailer');
const generatePassword = require('../utils/generate-password');

const { User } = require('../models/index');

router.post('/signup',asyncHandler(async (req, res) => {
    const { email, name, isAdmin, password,phoneNumber } = req.body;

    // 이미 회원가입되어있을때
    const existedUser = await User.findOne({$or:[
      {email},{phoneNumber}
    ]});

    if (existedUser) {
      const err = new Error('아이디 혹은 번호로 이미 가입되었습니다.');
      err.status = 401
      throw err;
    }
    
    const hashedPassword = hashPassword(password);
    await User.create({
      email,
      name,
      isAdmin,
      password: hashedPassword,
      phoneNumber
    });

    res.status(200).send({ message: '회원가입이 완료되었습니다' });
  }),
);

router.get('/logout',(req,res)=>{
  res.clearCookie('token');
  res.status(200).send({message:'로그아웃 되었습니다'});
});

//비밀번호 찾기 라우터
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { email } = req.body; 
  const existedUser = await User.findOne({email});
  if(!existedUser){
    const error = new Error('가입되지않은 계정입니다');
    error.status = 401;
    return error
  }
  //메일을 먼저 보내고, 비밀번호 변경하기
  const newPassword = generatePassword();
  try{
    await sendMail(email, "TEAM7: 새로운 패스워드 입니다.",`요청하신 새로운 패스워드 입니다: ${newPassword}`);//to ,subject,text
    await User.updateOne({email},{password: hashPassword(newPassword)});
    res.json({'success':"메일이 발송되었습니다."});
  }catch(err){
    const error = new Error('Server too busy')
    error.status = 421
    throw error
  }
  
}));

//계정찾기 라우터
router.post('/find-email', asyncHandler(async(req,res)=>{
  const {phoneNumber} = req.body;
  const existingUser = await User.findOne({phoneNumber});
  
  if(!existingUser){
    const error = new Error('가입되지 않은 번호입니다.');
    error.status = 401
    return error
  } 
  try{
    const email = existingUser.email;
    await sendMail(email, "TEAM7: 요청하신 아이디 입니다.",`요청하신 아이디 입니다: ${email}`);
    res.json({'success':"메일이 발송되었습니다."});
  }catch(err){
    const error = new Error('Server too busy')
    error.status = 421
    throw error
  }
}))

module.exports = router;
