const { default: axios } = require("axios");
const qs = require("qs");
const static = require("../static");
const staticFunc = require("../staticFunction");

const originalUrl = `${static.ADMIN_PATH}${static.PRODUCT_PATH}`;

const displayMainPage = async (req, res, next, notyfOptionsParam) => {
  let { p } = req.query;
  let { s } = req.query;

  let products = [];
  let notyfOptions = null;
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
  apiUrl = `${static.API_URL}${static.API_PRODUCT_PATH}?offset=${offset}&limit=${limit}`;

  if (s != null) {
    search = s;
    apiUrl = `${static.API_URL}${static.API_PRODUCT_PATH}?search=${search}`;
  }

  await axios.get(`${static.API_URL}${static.API_PRODUCT_PATH}${static.API_COUNT_PATH}`).then((res) => (total = res.data.data));

  await axios
    .get(apiUrl)
    .then((res) => res.data)
    .then((data) => {
      console.log(data);
      if (data.statusCode == 200) {
        products = data.data;
        count = products.length;
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      if (s != null) total = products.length;

      if (notyfOptionsParam != null) notyfOptions = notyfOptionsParam;

      res.render(`${static.VIEWS_PAGE_DIR}${static.PRODUCT_DIR}${static.PRODUCT_VIEW}`, {
        title: "Products",
        breadcrumb: staticFunc.initBreadcrumbOptions("Products", "Management", false),
        products: products,
        notyfOptions: notyfOptions,
        originalUrl: originalUrl,
        pagination: staticFunc.initPagination(perPage, total, count, Math.ceil(total / perPage), offset + 1),
        keyword: s != null ? search : "",
        modal: { content: static.DELETE_PRODUCT_QUESTION },
      });
    })
    .catch((err) => console.log(err));
};

exports.returnProductPage = async (req, res, next) => {
  await displayMainPage(req, res, next);
};

exports.returnAddProductPage = (req, res, next) => {
  res.render(`${static.VIEWS_PAGE_DIR}${static.PRODUCT_DIR}${static.ADD_PRODUCT_VIEW}`, {
    title: "Add Product",
    breadcrumb: staticFunc.initBreadcrumbOptions("Products", "New", true),
    notyfOptions: null,
    originalUrl: originalUrl,
  });
};

exports.returnProductDetailPage = (req, res, next) => {
  res.render(`${static.VIEWS_PAGE_DIR}${static.PRODUCT_DIR}${static.PRODUCT_DETAIL_VIEW}`, {
    title: "Product",
    breadcrumb: "",
  });
};

exports.returnEditProductPage = (req, res, next) => {
  res.render(`${static.VIEWS_PAGE_DIR}${static.PRODUCT_DIR}${static.EDIT_PRODUCT_VIEW}`, {
    title: "Product Management",
    breadcrumb: "Edit ",
  });
};

exports.addProduct = (req, res, next) => {

  const {name, quantity, price, category, description} = req.body;

  axios
    .put(`${static.API_URL}${static.API_PRODUCT_PATH}`, {
      name: name,
      quantity: quantity,
      price: price,
      category: category,
      description: description,
    })
    .then((res) => res.data)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
};

exports.updateProduct = (req, res, next) => {};

exports.deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  let notyfOptions = null;

  await axios
    .delete(`${static.API_URL}${static.API_PRODUCT_PATH}/${id}`)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_SUCCESS, data.message);
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      await displayMainPage(req, res, next, notyfOptions);
    })
    .catch((err) => console.log(err));
};
