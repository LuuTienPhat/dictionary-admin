const static = require("../static");
const cookieParser = require("cookie-parser");
const staticFunc = require('../staticFunction')
require("dotenv").config();

const API_SECRET_KEY = process.env.API_SECRET_KEY || ""

exports.checkAuthentication = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  
  if (accessToken != null) {
    await staticFunc.verifyToken(accessToken, API_SECRET_KEY)
    .then((result) => next()) 
    .catch((err) => {
      res.redirect('/admin/logout')
    })
  }
  else return res.redirect('/admin/logout');
};

exports.checkAuthorization = (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  
  if (accessToken == null) return next();
  else return res.redirect("/admin/dashboard")
};
