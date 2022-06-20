const { default: axios } = require("axios");
const qs = require("qs");
const static = require("../static");
const staticFunc = require("../staticFunction");

exports.returnDashboardPage = async (req, res, next) => {
  let stat = null;
  let count = 0;
  let mostViewedProducts = [];
  let mostViewedWords = [];
  let latestOrders = [];

  await axios
    .get(`${static.API_URL}${static.API_PRODUCT_PATH}/most-viewed`)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        mostViewedProducts = data.data;
      }
    })
    .catch((err) => console.log(err));

    await axios
    .get(`${static.API_URL}${static.API_VOCABULARY_PATH}/most-viewed`)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        mostViewedWords = data.data;
      }
    })
    .catch((err) => console.log(err));

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
    .get(`${static.API_URL}${static.API_STAT_PATH}`)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        stat = data.data;
      }

      res.render(`${static.VIEWS_PAGE_DIR}${static.DASHBOARD_DIR}/${static.dashboardView}`, {
        stat: stat,
        title: "Dashboard",
        mostViewedProducts: mostViewedProducts,
        mostViewedWords: mostViewedWords,
        latestOrders: latestOrders,
      });
    })
    .catch((err) => console.log(err));
};

exports.returnViewPage = (req, res, next) => {
  res.render(`${viewsPagesDir}${dashboardDir}`, {
    title: "Dashboard",
  });
};
