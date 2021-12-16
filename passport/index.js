const passport = require('passport');

const local = require('./strategies/local');
const jwt = require('./strategies/jwt');

module.exports = () => {
  passport.use(local);
  // jwt strategy 사용
  passport.use(jwt);
};