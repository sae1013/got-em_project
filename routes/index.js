const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/async-handler');
const hashPassword = require('../utils/hash-password');
const logout = require('express-passport-logout');

const { User } = require('../models/index');

router.post('/signup',asyncHandler(async (req, res) => {
    const { email, name, isAdmin, password } = req.body;

    // 이미 회원가입되어있을때
    const signedUpEmail = await User.findOne({
      email: email,
    });

    if (signedUpEmail) {
      const err = new Error('중복된 사용자 입니다');
      err.status = 401
      throw err;
      
    }
    const hashedPassword = hashPassword(password);
    await User.create({
      email,
      name,
      isAdmin,
      password: hashedPassword,
    });

    res.status(200).send({ message: '회원가입이 완료되었습니다' });
  }),
);

router.get('/logout',(req,res)=>{
  res.clearCookie('token');
  res.status(200).send({message:'로그아웃 되었습니다'});
})

module.exports = router;
