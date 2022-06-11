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

exports.renderRole = (req) => {
  const { accessToken } = req.cookies;

  const roles = this.decodeJWT(accessToken).roles;

  let menu = [];

  if (roles.includes("ROLE_ADMIN_WORD")) {
    menu.push("vocabulary");
    menu.push("part of speech");
  }
  if (roles.includes("ROLE_ADMIN_SALE")) {
    menu.push("category");
    menu.push("product");
    menu.push("order");
  }
  if (roles.includes("ROLE_MANGER")) {
    menu.push("role");
    menu.push("user");
  }

  return menu;
};


