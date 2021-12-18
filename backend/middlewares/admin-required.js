const adminRequired = (req, res, next) => {
  if (!req.user.isAdmin) {
    const err = new Error('접근권한이 없습니다');
    err.status = 401;
    next(err)
    return
  }
  
  next();
}

module.exports = adminRequired
