const express = require("express");
const morgan = require("morgan");
const usersRouter = require("./routes/users");
const questionsRouter = require("./routes/questions");

const app = express();

app.use("/users", usersRouter);
app.use("/questions", questionsRouter);
