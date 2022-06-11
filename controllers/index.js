const static = require('../static')

exports.index = (req, res, next) => {
  res.render("index", { title: "Express" });
};

exports.returnDashboardPage = (req, res, next) => {
  res.render(`${static.VIEWS_PAGE_DIR}/${static.DASHBOARD_DIR}/${static.dashboardView}`, { title: "Dashboard" });
};
