const { DASHBOARD_DIR: dashboardDir, VIEWS_PAGE_DIR: viewsPagesDir, dashboardView } = require("../static");

exports.returnDashboardPage = (req, res, next) => {
  res.render(`${viewsPagesDir}${dashboardDir}/${dashboardView}`, {
    title: "Dashboard",
  });
};

exports.returnViewPage = (req, res, next) => {
  res.render(`${viewsPagesDir}${dashboardDir}`, {
    title: "Dashboard",
  });
};
