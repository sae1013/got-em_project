const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/async-handler');
const hashPassword = require('../utils/hash-password');
const sendMail = require('../utils/node-mailer');

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

//비밀번호 찾기
router.post('/find-password', asyncHandler(async (req, res) => {
  const { email } = req.body;
  const message = 'hello'
  await sendMail(email, "You've received a message", message);
  res.send("메일이 발송되었습니다.");
}));

module.exports = router;
