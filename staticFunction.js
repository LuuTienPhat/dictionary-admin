const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const { returnSignInPage } = require("./controllers/account.controller");

exports.initBreadcrumbOptions = (parent, title, hideBtnNew) => {
  return {
    hideBtnNew: hideBtnNew,
    title: title,
    parent: parent,
  };
};

exports.initNotyfOptions = (type, content) => {
  return JSON.stringify({
    type: type,
    content: content,
  });
};

exports.initPagination = (perPage, total, count, pages, current) => {
  return {
    perPage: perPage,
    total: total,
    count: count,
    pages: pages,
    current: current,
  };
};

exports.Money = (money) => {
  return Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(money);
};

exports.decodeJWT = (token) => {
  return jwt_decode(token);
};

exports.verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
};

exports.getAccessToken = (req) => {
  const { accessToken } = req.cookies;
  return accessToken;
};

exports.axiosOptions = (req) => {
  const { accessToken } = req.cookies;
  
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};


