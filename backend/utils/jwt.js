const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET_KEY;

exports.setUserToken = (res, user) => {
  
  
  // 유저 jwt 토큰생성
  const token = jwt.sign(user,secret);
  res.cookie('token', token, {
    maxAge: 1000*60*60*24*7,  //7일
    sameSite:'none',
    httpOnly:true,
  });

}