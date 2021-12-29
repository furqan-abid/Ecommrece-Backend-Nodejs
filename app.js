var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');
var filestore=require('session-file-store')(session)
var passport=require('passport');
var authenticate=require('./authenticate')
let config=require('./config')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishesrouter = require('./routes/dishrouter');
var promorouter = require('./routes/promorouter');
var leaderrouter = require('./routes/leadersrouter');
var uploadrouter = require('./routes/uploadrouter')
var favouriterouter = require('./routes/Favouriterouter')
var commentsRouter = require('./routes/commentsrouter')

const mongoose=require('mongoose');
const dishes=require('./models/dishes');
const url=config.mongoUrl;

const connect=mongoose.connect(url);

connect.then((db)=>{
  console.log('connected to server');
},(err)=>{console.log(err)});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321'));


app.use(passport.initialize());
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/dishes',dishesrouter);
app.use('/promo',promorouter);
app.use('/leader',leaderrouter);
app.use('/imageupload',uploadrouter)
app.use('/favourite',favouriterouter)
app.use('/comments',commentsRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports=app;
