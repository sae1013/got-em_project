const passport = require('passport');

module.exports = (req, res, next) => {
  if (!req.cookies.token) { //유저토큰이 없을때는 ,로그인인증이필요함
    next();
    return;
  }
 
  return passport.authenticate('jwt', { session: false })(req, res, next); // 유저토큰이 있을 때는 인증을 통해서 req객체에 박아서 넣어줌
}