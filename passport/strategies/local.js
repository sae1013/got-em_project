const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../../models');
const hashPassword = require('../../utils/hash-password');

const config = {
  usernameField:'email', 
  passwordField:'password'
};

const local = new LocalStrategy(config, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('가입되지 않은 회원입니다.');
    }
    
    if (user.password !== hashPassword(password)) {
      throw new Error('비밀번호를 다시 확인해주세요');
    }

    done (null, {
      shortId: user.shortId,
      email: user.email,
      name: user.name,
      nickName:user.nickName,
      phoneNumber:user.phoneNumber,
      isAdmin:user.isAdmin,
    });
  } catch (err) {
    err.status = 401; //에러 발생시 처리 미들웨어에서 일괄로 상태코드 지정.
    done(err, null);
  } 
});

module.exports = local;