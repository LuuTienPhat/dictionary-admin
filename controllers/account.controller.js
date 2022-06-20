const { default: axios } = require("axios");
const qs = require("qs");
const { API_URL: apiURL, apiLoginPath, API_USER_PATH: apiUsersPath } = require("../static");
const { checkAuthentication, checkAuthorization } = require("../middlewares/auth.middleware");
const static = require("../static");
const staticFunc = require("../staticFunction");

exports.returnSignInPage = async (req, res, next) => {
  let notyfOptions = await req.consumeFlash('notyfOptions');

  res.render("pages/sign-in", {
    title: "Sign In",
    notyfOptions: notyfOptions[0]
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
          refreshToken = data.refresh_token;
          accessToken = data.access_token;
  
          let decodedToken = staticFunc.decodeJWT(accessToken);
          let userId = decodedToken.sub;
          let roles = decodedToken.roles;

          if(roles.includes("ROLE_CUSTOMER")) {
            let notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, "The username or password are incorrect");
            await req.flash("notyfOptions", notyfOptions);
            return res.redirect("/admin/login");
          }
          else {
            let maxAge = 1000 * 60 * 60 * 24;
            let cookieOption = { maxAge: maxAge, httpOnly: true }
    
            res.cookie("accessToken", accessToken, cookieOption);
            res.cookie("refreshToken", accessToken, cookieOption);
            res.cookie("userId", userId, cookieOption);
    
            return res.redirect("/admin/dashboard"); 
          }
    })
    .catch(async (err) => {

      let notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, "The username or password are incorrect");
      await req.flash("notyfOptions", notyfOptions);
      return res.redirect("/admin/login");

    });
};

exports.logOut = (req, res, next) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.clearCookie("userId");
  res.redirect(`${static.ADMIN_PATH}${static.loginPath}`);
};
