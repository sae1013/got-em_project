const createError = require('http-errors');
const express = require('express');
const path = require('path');

//Third Party
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const passportSettingRouter = require('./passport/index');
// mongoose 
const mongoose = require('mongoose');
//router
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const app = express();

// DB connection
mongoose.connect('mongodb://localhost:27017/elice')
mongoose.connection.on('connect', ()=>{
  console.log('mongoDB connected');
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '7team_project',
  resave: false,
  saveUninitialized: true,
  cookie:{maxAge:3600000} // 쿠키만료 1시간설정
  
}));
passportSettingRouter();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth',authRouter);
// app.use('/users', usersRouter);
// app.use('/posts',postsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log('에러핸들러()');
  // set locals, only providing error in development
  res.locals.message = err.message; 
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err.message);
});

module.exports = app;