const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const session = require("express-session");
const indexRouter = require('./routes/index');
//const usersRouter = require('./routes/data');

const app = express();

const sessions = session({
  key: indexRouter.random(10),
  secret: indexRouter.random(20),
  name: indexRouter.random(12),
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600 * 1000
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.disable("x-powered-by");
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessions);
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
})

app.use(function (req, res, next) {
  const fs = require("fs");

  if (req.headers.referer !== undefined || req.headers.referer === "") {
    const url = require("url").parse(req.headers.referer).hostname;
    if (!fs.existsSync("Referer.json")) {
      fs.writeFileSync("Referer.json", '{}');
    }
    const referer = JSON.parse(fs.readFileSync("Referer.json").toString());
    let count = 1;
    if (url in referer) {
      count = count + referer[url];
    }
    referer[req.headers.referer] = count;
    fs.writeFileSync('Referer.json', JSON.stringify(referer, null ,4))
    if (url === "t.co" || url === "twitter.com") {
      res.status(418).render("error", {twt: true})
    } else {
      next();
    }
  } else {
    next();
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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
  console.log(err);
  res.render('error');
});

module.exports = app;
