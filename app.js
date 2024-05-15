require("dotenv").config();
require("./config/database");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { CLIENT, SECRET, SESSION_SECRET } = process.env;
const cors = require("cors");
const auth = { user: CLIENT, pass: SECRET };
var indexRouter = require("./routes/index");
var app = express();
const { webhookController } = require("./controllers/payment");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.post("/webhook",express.raw({ type: 'application/json' }), webhookController);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(cors());

const corsOptions = {
  origin: "https://tradesinlimites.com.ar",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
