const staticFunc = require('../staticFunction');

exports.render = (req, res, next) => {
    const { accessToken } = req.cookies;
  
    const roles = staticFunc.decodeJWT(accessToken).roles;
  
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
  
    next()
  };