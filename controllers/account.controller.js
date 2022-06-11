const { default: axios } = require("axios");
const qs = require("qs");
const { API_URL: apiURL, apiLoginPath, apiUsersPath} = require("../static");
const { checkAuthentication, checkAuthorization } = require("../middlewares/auth.middleware");
const static = require('../static');
const staticFunc = require("../staticFunction");

exports.returnSignInPage = (req, res, next) => {
  res.render("pages/sign-in", {
    title: "Sign In",
  });
};

exports.returnSignUpPage = (req, res, next) => {
  res.render("pages/sign-up", {
    title: "Sign Up",
  });
};

exports.returnForgotPasswordPage = (req, res, next) => {
  res.render("pages/forgot-password", {
    title: "Sign Up",
  });
};

exports.returnResetPasswordPage = (req, res, next) => {
  res.render("pages/reset-password", {
    title: "Sign Up",
  });
};

var refreshToken = "";
var accessToken = "";

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  await axios
    .post(
      `${apiURL}${apiUsersPath}${apiLoginPath}`,
      qs.stringify({
        username: username,
        password: password,
      }),
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      },
    )
    .then((res) => res.data)
    .then(async (data) => {
      console.log(data);
      refreshToken = data.refresh_token;
      accessToken = data.access_token;
      
      let userId = staticFunc.decodeJWT(accessToken).sub;

      res.cookie('accessToken', accessToken, { maxAge: 1000 * 60 * 30, httpOnly: true });
      res.cookie('refreshToken', accessToken, { maxAge: 1000 * 60 * 30, httpOnly: true });
      res.cookie('userId', userId, { maxAge: 1000 * 60 * 30, httpOnly: true });
     
      res.redirect("/admin/dashboard");
    })
    .catch((err) => console.log(err));
};

exports.logOut = (req, res, next) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.clearCookie("userId");
  res.redirect(`${static.ADMIN_PATH}${static.loginPath}`);
};
