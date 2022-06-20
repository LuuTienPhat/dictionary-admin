const staticFunc = require('../staticFunction');
const static = require('../static');
const axios = require('axios');

exports.render = async (req, res, next) => {
    const { accessToken } = req.cookies;
  
    const decode = staticFunc.decodeJWT(accessToken);

    const roles = decode.roles;
    const userId = decode.sub;
  
    let latestOrders = [];
    let controller = null;

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
    if (roles.includes("ROLE_MANAGER")) {
      menu.push("vocabulary");
      menu.push("part of speech");
      menu.push("category");
      menu.push("product");
      menu.push("order");
      menu.push("role");
      menu.push("user");
    }
  
    res.locals.sidebar = menu;
    
    await axios
    .get(`${static.API_URL}${static.API_ORDER_PATH}/latest`)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        latestOrders = data.data;
      }
    })
    .catch((err) => console.log(err));

    await axios
    .get(`${static.API_URL}${static.API_USER_PATH}/${userId}`)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        controller = data.data;
      }
    })
    .catch((err) => console.log(err));

    res.locals.latestOrders = latestOrders;
    res.locals.controller = controller;

    next()
  };