const express = require("express");
const morgan = require("morgan");
const usersRouter = require("./routes/users");
const questionsRouter = require("./routes/questions");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { environment, sessionSecret } = require('./config');
const store = require('connect-pg-simple');
const { restoreUser } = require('./auth');
const { propfind } = require("./routes/users");
const app = express();
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(express.static('public/js'));
app.use(morgan('dev'));
app.use(cookieParser(sessionSecret));
app.get('/', (req, res) => {
  res.render('layout')
});

app.use(session({
  name: 'question-forum.sid',
  store: new (store(session))(),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));
app.use(restoreUser);


app.use("/users", usersRouter);
app.use("/questions", questionsRouter);

app.use((req, res, next) => {
  const err = new Error('The requested page couldn\'t be found.');
  err.status = 404;
  next(err);
});

// Custom error handlers.

// Error handler to log errors.
app.use((err, req, res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    err.errors = err.errors.map((e) => e.message);
    err.title = "Sequelize Error";
  }
  next(err);
});

// Error handler for 404 errors.
app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404);
    res.render('page-not-found', {
      title: 'Page Not Found',
    });
  } else {
    next(err);
  }
});

// Generic error handler.
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  const isProduction = environment === 'production';
  res.render('error', {
    title: 'Server Error',
    message: isProduction ? null : err.message,
    stack: isProduction ? null : err.stack,
  });
});

module.exports = app;
