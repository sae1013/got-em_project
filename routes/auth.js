const { Router } = require('express');
const passport = require('passport');

const router = Router();

// passport local 로 authenticate 하기

router.post('/', passport.authenticate('local'),(req, res, next) => {
     // 로그인 성공시에 현재 미들웨어를 타게된다.
    res.status(200).json(req.user);
    return
});

module.exports = router;


