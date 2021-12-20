const { Router } = require('express');
const passport = require('passport');
const {setUserToken} = require('../utils/jwt');
const router = Router();

//로그인
router.post('/', passport.authenticate('local',{session:false}),(req, res, next) => {
    
    setUserToken(res,req.user);
    res.status(200).json(req.user);
    
});

module.exports = router;
