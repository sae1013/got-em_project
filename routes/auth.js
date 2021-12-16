const { Router } = require('express');
const passport = require('passport');
const {setUserToken} = require('../utils/jwt');
const router = Router();

router.post('/', passport.authenticate('local',{session:false}),(req, res, next) => {
     // 로그인 성공시에 현재 미들웨어를 타게된다.
    setUserToken(res,req.user);
    res.status(200).json(req.user);
    
});

module.exports = router;
