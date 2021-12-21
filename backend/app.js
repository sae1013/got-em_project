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

//middleware
const loginRequired = require('./middlewares/login-required');
const adminRequired = require('./middlewares/admin-required');

//router
const routerPackage = require('./routes/routes-package');
const {authRouter,indexRouter,postRouter,productRouter,userRouter,imageRouter} = routerPackage;
const testRouter = require('./routes/test');
//express-app
const app = express();

// DB connection
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connect', ()=>{
  console.log('mongoDB connected');
});

// localhost Cors whitelist setup
// const whitelist = ['http://127.0.0.1:5502'];
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   credentials: true
// }

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passportSettingRouter();
app.use(passport.initialize());
app.use(getUserFromJWT);

app.use('/', indexRouter);
app.use('/auth',authRouter);
app.use('/users',userRouter);
app.use('/products',productRouter);
app.use('/posts',postRouter);
app.use('/images',imageRouter);
app.use('/test',testRouter);
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