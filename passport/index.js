const passport = require('passport');
const local = require('./strategies/local');

module.exports = () => {
  // local strategy 사용
  passport.use(local);  //패스포트
  passport.serializeUser((user, callback) => {
    callback(null, user);
  });

  passport.deserializeUser((obj, callback) => {
    callback(null, obj);
  });
};