const { default: axios } = require("axios");
const qs = require("qs");
const static = require("../static");
const staticFunc = require("../staticFunction");

exports.returnSalesChart = async (req, res, next) => {
    const id = req.params.id;
    let salesChart = null;
  
    await axios
      .get(`${static.API_URL}${static.API_STAT_PATH}/sales-chart`)
      .then((res) => res.data)
      .then(async (data) => {
        if (data.statusCode == 200) {
          salesChart = data.data;
        }
        return res.status(200).json(salesChart);
      })
      .catch((err) => console.log(err));
  };

  exports.returnOrdersChart = async (req, res, next) => {
    const id = req.params.id;
    let ordersChart = null;
  
    await axios
      .get(`${static.API_URL}${static.API_STAT_PATH}/orders-chart`)
      .then((res) => res.data)
      .then(async (data) => {
        if (data.statusCode == 200) {
          ordersChart = data.data;
        }
        return res.status(200).json(ordersChart);
      })
      .catch((err) => console.log(err));
  };
