const loginRequired = (req, res, next) => {
  if (!req.user) {
    const err = new Error('로그인이 필요합니다');
    err.status = 401;
    next(err)
  }
  
  next();
}

module.exports = loginRequired
