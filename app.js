var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/data');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.disable("x-powered-by");
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

app.use(function (req, res, next) {
  const fs = require("fs")
  if (req.referrer !== undefined || req.referrer === "") {
    if (!fs.existsSync("Referer.json")) {
      fs.writeFileSync("Referer.json", '{}')
    }
    const referer = JSON.parse(fs.readFileSync("Referer.json"));
    let count = 1;
    if (req.referrer in referer) {
      count = count + referer[name]
    }
    referer[req.referrer] = count
    next()
  } else {
    next()
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);

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

module.exports = app;
