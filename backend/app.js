/* Server that starts the backend*/

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/connect");
const PORT = 8080 || process.env.PORT;

const indexRouter = require("./routes/index");
const authRouter = require("./routes/authRoutes");
const taskRouter = require("./routes/taskRoutes");

const app = express();

// Helmet middleware added for security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "example.com"],
      },
    },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: true,
    hsts: true,
    hidePoweredBy: true,
    noCache: true,
    XContentOptions: "nosniff",
  })
);

// cors middleware is used to enable Cross-Origin Resource Sharing, allowing the server to handle requests from different domains.
app.use(
  cors({
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/users", authRouter);
app.use("/tasks", taskRouter);

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

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
