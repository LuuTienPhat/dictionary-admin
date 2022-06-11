var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var cors = require("cors");
var helmet = require("helmet");
var sanitizeHtml = require("sanitize-html");
const { flash } = require("express-flash-message");
var session = require("express-session");
var moment = require("moment");

const app = express();
const static = require("./static");

const publicDir = path.join(__dirname, "public");
const viewsDir = path.join(__dirname, "views");

const PORT = process.env.PORT || 8000;

const indexRouter = require("./routes/account.route");
const usersRouter = require("./routes/account");
const accountRouter = require("./routes/account");
const dashboardRouter = require("./routes/dashboard.route");
const vocabularyRouter = require("./routes/vocabulary.route");
const partOfSpeechRouter = require("./routes/partOfSpeech.route");
const feedbackRouter = require("./routes/feedback.route");
const mailRouter = require("./routes/mail.route");
const profileRouter = require("./routes/profile.route");
const categoryRouter = require("./routes/category.route");
const productRouter = require("./routes/product.route");
const orderRouter = require("./routes/order.route");
const auth = require("./middlewares/auth.middleware");
const sidebar = require("./middlewares/sidebar.middleware");
const staticFunc = require("./staticFunction");
const { logOut } = require("./controllers/account.controller");

// view engine setup
app.set("views", viewsDir);
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(helmet());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      // secure: true, // becareful set this option, check here: https://www.npmjs.com/package/express-session#cookiesecure. In local, if you set this to true, you won't receive flash as you are using `http` in local, but http is not secure
    },
  }),
);
app.use(flash({ sessionKeyName: "flashMessage" }));

const absoluteDashboardPath = `${static.ADMIN_PATH}${static.dashboardPath}`;
const absoluteVocabularyPath = `${static.ADMIN_PATH}${static.VOCABULARY_PATH}`;
const absolutePartOfSpeechPath = `${static.ADMIN_PATH}${static.partOfSpeechPath}`;
const absoluteFeedbackPath = `${static.ADMIN_PATH}${static.feedbackPath}`;
const absoluteMailPath = `${static.ADMIN_PATH}${static.MAIL_PATH}`;
const absoluteProfilePath = `${static.ADMIN_PATH}${static.PROFILE_PATH}`;
const absoluteCategoryPath = `${static.ADMIN_PATH}${static.CATEGORY_PATH}`;
const absoluteProductPath = `${static.ADMIN_PATH}${static.PRODUCT_PATH}`;
const absoluteOrderPath = `${static.ADMIN_PATH}${static.ORDER_PATH}`;

app.locals.pagesPath = {
  dashboardPagePath: absoluteDashboardPath,
  vocabularyPagePath: absoluteVocabularyPath,
  partOfSpeechPagePath: absolutePartOfSpeechPath,
  feedbackPagePath: absoluteFeedbackPath,
  mailPagePath: absoluteMailPath,
  profilePagePath: absoluteProfilePath,
  categoryPagePath: absoluteCategoryPath,
  productPagePath: absoluteProductPath,
  orderPagePath: absoluteOrderPath,
  settingsPagePath: "",
};

app.locals.NotyfType = {
  NOTYF_SUCCESS: static.NOTYF_SUCCESS,
  NOTYF_WARNING: static.NOTYF_WARNING,
  NOTYF_DANGER: static.NOTYF_DANGER,
};

app.locals.moment = moment;

app.locals.Money = staticFunc.Money;

app.use(`${static.ADMIN_PATH}/login`, auth.checkAuthorization, indexRouter);
app.use(`${static.ADMIN_PATH}users`, auth.checkAuthorization, usersRouter);
app.use(absoluteDashboardPath, auth.checkAuthentication, sidebar.render ,dashboardRouter);
app.use(absoluteVocabularyPath, auth.checkAuthentication, sidebar.render, vocabularyRouter);
app.use(absolutePartOfSpeechPath, auth.checkAuthentication, sidebar.render,partOfSpeechRouter);
app.use(absoluteFeedbackPath, auth.checkAuthentication, sidebar.render,feedbackRouter);
app.use(absoluteMailPath, auth.checkAuthentication, sidebar.render,mailRouter);
app.use(absoluteProfilePath, auth.checkAuthentication, sidebar.render,profileRouter);
app.use(absoluteCategoryPath, auth.checkAuthentication, sidebar.render,categoryRouter);
app.use(absoluteProductPath, auth.checkAuthentication, sidebar.render,productRouter);
app.use(absoluteOrderPath, auth.checkAuthentication, sidebar.render, orderRouter);
app.get(`${static.ADMIN_PATH}/logout`, auth.checkAuthentication ,logOut)

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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
