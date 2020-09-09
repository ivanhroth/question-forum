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

app.use(morgan('dev'));
app.use(cookieParser(sessionSecret));
app.get('/', (req, res) => {
  res.send('Hello World')
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

module.exports = app;
