const JwtStrategy = require('passport-jwt').Strategy;
const secret = process.env.JWT_SECRET_KEY;

const cookieExtractor = (req) => {
  // req 의 cookies 에서 token 사용하기
      const {token} = req.cookies;
      return token
  };

const opts = {
  secretOrKey: secret,//./utils/jwt 의 secret 사용하기
  jwtFromRequest: cookieExtractor,
}

module.exports = new JwtStrategy(opts, (user, done) => {
  done(null, user);
}); // 이 모듈이 로그인 이미 진행된 경우, 쿠키를 확인해서 토큰을 리턴한다음,
// 앞으로 이어질 미들웨어에 user객체를 반환하는 모듈임.

