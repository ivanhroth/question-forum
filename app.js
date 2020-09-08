const express = require("express");
const morgan = require("morgan");
const usersRouter = require("./routes/users");
const questionsRouter = require("./routes/questions");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { environment, sessionSecret } = require('./config');

const app = express();

app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(cookieParser(sessionSecret));

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.use(session({
  name: 'question-forum.sid',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

app.use(express.urlencoded({ extended: false }));

app.use("/users", usersRouter);
app.use("/questions", questionsRouter);

module.exports = app;
