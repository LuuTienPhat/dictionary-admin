const static = require("../static");
var cookieParser = require("cookie-parser");
const staticFunc = require('../staticFunction')
require("dotenv").config();
var axios = require('axios'); 

const API_SECRET_KEY = process.env.API_SECRET_KEY || ""

exports.checkAuthentication = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  
  if (accessToken != null) {
    await staticFunc.verifyToken(accessToken, API_SECRET_KEY)
    .then((result) => {
      axios.defaults.headers.common['Authorization'] =  `Bearer ${accessToken}`;
      return next();
    }) 
    .catch((err) => {
      res.redirect('/admin/logout')
    })
  }
  else return res.redirect('/admin/logout');
};

exports.checkAuthorization = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  
  if (accessToken == null) return next();
  else {
    await staticFunc.verifyToken(accessToken, API_SECRET_KEY)
    .then((result) => {
      axios.defaults.headers.common['Authorization'] =  `Bearer ${accessToken}`;
      return res.redirect('/admin/dashboard');
    }) 
    .catch((err) => {
      return res.redirect('/admin/logout')
    })
  }
};
