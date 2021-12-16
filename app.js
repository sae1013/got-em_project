const createError = require('http-errors');
const express = require('express');
const path = require('path');
require('dotenv').config();
//Third Party middlewares
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const passportSettingRouter = require('./passport/index');
const getUserFromJWT = require('./middlewares/get-user-from-jwt');
// mongoose 
const mongoose = require('mongoose');

//router
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const testRouter= require('./routes/test');
const loginRequired = require('./middlewares/login-required');
const app = express();

// DB connection
mongoose.connect('mongodb://localhost:27017/elice')
mongoose.connection.on('connect', ()=>{
  console.log('mongoDB connected');
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passportSettingRouter();
app.use(passport.initialize());
app.use(getUserFromJWT);

app.use('/', indexRouter);
app.use('/test',testRouter);
app.use('/auth',authRouter);

// app.use('/users', usersRouter);
// app.use('/posts',postsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message; 
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500); // 에러객체에 상태값을 뽑아서 응답
  res.json({
    error:err.message
  });
});

module.exports = app;