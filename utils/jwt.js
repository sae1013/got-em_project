const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET_KEY;

exports.setUserToken = (res, user) => {
  
  // 유저 jwt 토큰생성
  const token = jwt.sign(user,secret); // 토큰생성
  // 토큰을 응답쿠키에 심어줌
  res.cookie('token', token,{
    maxAge: 1000*60*60 *24  // 하루 동안 유지.
  });
}