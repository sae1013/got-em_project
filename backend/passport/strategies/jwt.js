const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');

const secret = process.env.JWT_SECRET_KEY;
const {User} = require('../../models/index');

const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_AUTHORIZATION_KEY,
};

const JWTVerify = async (jwtPayload,done) => {
  
  try {
    const user = await User.findOne({email:jwtPayload.email});
    if(user){
      done(null,user); //req.user 
      return;
    }
    done(null,false,{message:'잘못된 토큰입니다'});
  }catch(err){
    done(err);
  }
}

module.exports = new JwtStrategy(JWTConfig, JWTVerify); 

//매 요청마다 유저검증로직