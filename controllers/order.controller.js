const { default: axios } = require("axios");
const qs = require("qs");
const static = require("../static");
const staticFunc = require("../staticFunction");

const originalUrl = `${static.ADMIN_PATH}${static.ORDER_PATH}`;

exports.returnOrderPage = async (req, res, next) => {
  let { p } = req.query;
  let { s } = req.query;
  let { state } = req.query;

  let orders = [];
  let notyfOptions = null;
  let notyfOptionsFlash = null;
  let count = 58000;
  let perPage = 20;
  let offset = 0;
  let limit = 20;
  let total = 0;
  let search = "";
  let apiUrl = "";

  if (p != null) {
    offset = parseInt(p) - 1;
  }
  apiUrl = `${static.API_URL}${static.API_ORDER_PATH}?offset=${offset}&limit=${limit}`;

  if (s != null) {
    search = s;
    apiUrl = `${static.API_URL}${static.API_ORDER_PATH}?search=${encodeURIComponent(search)}`;
  }

  if (state != null && state != '') {
    apiUrl = `${static.API_URL}${static.API_ORDER_PATH}?state=${state}`;
  }

  await axios.get(`${static.API_URL}${static.API_ORDER_PATH}${static.API_COUNT_PATH}`).then((res) => (total = res.data.data));

  await axios
    .get(apiUrl)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        orders = data.data;
        count = orders.length;
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      if (s != null) total = orders.length;

      notyfOptionsFlash = await req.consumeFlash("notyfOptions");
      if (notyfOptionsFlash.length != 0) notyfOptions = notyfOptionsFlash[0];
    })
    .catch((err) => console.log(err));

  return res.render(`${static.VIEWS_PAGE_DIR}${static.ORDER_DIR}${static.ORDER_VIEW}`, {
    title: "Orders",
    breadcrumb: staticFunc.initBreadcrumbOptions("Orders", "Management", true),
    orders: orders,
    notyfOptions: notyfOptions,
    originalUrl: originalUrl,
    pagination: staticFunc.initPagination(perPage, total, count, Math.ceil(total / perPage), offset + 1),
    keyword: s != null ? search : "",
    state: state == '' ? null : state == null ? null : state
  });

};

exports.returnOrderDetailPage = async (req, res, next) => {
  const id = req.params.id;
  let order = null;
  let products = [];
  let notyfOptions = null;
  let notyfOptionsFlash = await req.consumeFlash("notyfOptions");
  if (notyfOptionsFlash.length != 0) notyfOptions = notyfOptionsFlash[0];

  await axios
    .get(`${static.API_URL}${static.API_ORDER_PATH}/${id}`)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        order = data.data;
        products = await getProducts(order.orderDetails);
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }  

      return res.render(`${static.VIEWS_PAGE_DIR}${static.ORDER_DIR}${static.ORDER_DETAIL_VIEW}`, {
        title: `Order ${order.id}`,
        breadcrumb: staticFunc.initBreadcrumbOptions("Orders",`Order ${order.id}`, true),
        order: order,
        notyfOptions: notyfOptions,
        products: products,
        originalUrl: originalUrl,
        keyword: "",
      });

    })
    .catch((err) => console.log(err))    
};

exports.updateOrder = async (req, res, next) => {
  const { id } = req.params;
  const { state } = req.body;
  let notyfOptions = null;

  await axios
    .put(`${static.API_URL}${static.API_ORDER_PATH}/${id}`, {
      state: state,
    })
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_SUCCESS, data.message);
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      await req.flash("notyfOptions", notyfOptions);
      res.redirect(req.originalUrl);
    })
    .catch((err) => console.log(err));
};

const getProducts = async (orderDetails) => {
  let products = [];
  let all = [];

  all = orderDetails.map(item => {
    return axios.get(`${static.API_URL}${static.API_PRODUCT_PATH}/${item.productId}`)
  })

  await axios.all(all)
  .then((res) => res.map((item => item.data)))
  .then(data => {
    products = data.map(item => item.data)
  });

  return products;

  // await axios
  //   .get(`${static.API_URL}${static.API_PRODUCT_PATH}/${id}`)
  //   .then((res) => res.data)
  //   .then(async (data) => {
  //     if (data.statusCode == 200) {
  //       product = data.data;
  //     }
  //   })
  //   .catch((err) => console.log(err));

    // return product;
};
