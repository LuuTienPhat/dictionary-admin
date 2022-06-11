const { default: axios } = require("axios");
const qs = require("qs");
const static = require("../static");
const staticFunc = require("../staticFunction");

const originalUrl = `${static.ADMIN_PATH}${static.CATEGORY_PATH}`


exports.returnCategoryPage = async (req, res, next) => {
  let { p } = req.query;
  let { s } = req.query;

  let categories = [];
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
  apiUrl = `${static.API_URL}${static.API_CATEGORY_PATH}?offset=${offset}&limit=${limit}`;

  if (s != null) {
    search = s;
    apiUrl = `${static.API_URL}${static.API_CATEGORY_PATH}?search=${encodeURIComponent(search)}`;
  }

  await axios.get(`${static.API_URL}${static.API_CATEGORY_PATH}${static.API_COUNT_PATH}`).then((res) => (total = res.data.data));

  await axios
    .get(apiUrl)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        categories = data.data;
        count = categories.length;
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      if(s != null ) total = categories.length;

      notyfOptionsFlash = await req.consumeFlash('notyfOptions');
      if(notyfOptionsFlash.length != 0) notyfOptions = notyfOptionsFlash[0];
    })
    .catch((err) => console.log(err));

    res.render(`${static.VIEWS_PAGE_DIR}${static.CATEGORY_DIR}${static.CATEGORY_VIEW}`, {
      title: "Categories",
      breadcrumb: staticFunc.initBreadcrumbOptions("Categories", "Management", false),
      categories: categories,
      notyfOptions: notyfOptions,
      originalUrl: originalUrl,
      pagination: staticFunc.initPagination(perPage, total, count, Math.ceil(total / perPage), offset + 1),
      keyword: s != null ? search : "",
      modal: {content: static.DELETE_CATEGORY_QUESTION},
    });
};

exports.returnAddCategoryPage = (req, res, next) => {
  res.render(`${static.VIEWS_PAGE_DIR}${static.CATEGORY_DIR}${static.ADD_CATEGORY_VIEW}`, {
    title: "Add Category",
    breadcrumb: staticFunc.initBreadcrumbOptions("Categories", "New", true),
    notyfOptions: null,
    originalUrl: originalUrl,
  });
};

exports.returnCategoryDetailPage = async (req, res, next) => {
  const id = req.params.id;
  let category = null;

  await axios
    .get(`${static.API_URL}${static.API_CATEGORY_PATH}/${id}`)
    .then((res) => res.data)
    .then((data) => {
      category = data.data;

      res.render(`${static.VIEWS_PAGE_DIR}${static.CATEGORY_DIR}${static.CATEGORY_DETAIL_VIEW}`, {
        title: category.name,
        breadcrumb: staticFunc.initBreadcrumbOptions("Category", category.id, true),
        category: category,
        notyfOptions: null,
        originalUrl: originalUrl,
      });
    })
    .catch((err) => console.log(err));
};

exports.returnEditCategoryPage = async (req, res, next) => {
  const id = req.params.id;
  let category = null;

  await axios
    .get(`${static.API_URL}${static.API_CATEGORY_PATH}/${id}`)
    .then((res) => res.data)
    .then((data) => {
      category = data.data;

      res.render(`${static.VIEWS_PAGE_DIR}${static.CATEGORY_DIR}${static.EDIT_CATEGORY_VIEW}`, {
        title: category.name,
        breadcrumb: staticFunc.initBreadcrumbOptions("Category", category.name, true),
        category: category,
        notyfOptions: null,
        originalUrl: `${req.originalUrl}`,
      });
    })
    .catch((err) => console.log(err));
};

exports.addCategory = async (req, res, next) => {
  const { name, description } = req.body;
  let notyfOptions = null;

  await axios
    .post(`${static.API_URL}${static.API_CATEGORY_PATH}`, {
      name: name,
      description: description
    })
    .then((res) => res.data)
    .then(async (data) => {
      if(data.statusCode == 200) {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_SUCCESS, data.message);        
      }
      else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message)
      }

      await req.flash('notyfOptions', notyfOptions);
      res.redirect('/admin/categories');
      
    })
    .catch((err) => console.log(err));
};

exports.updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;
  let notyfOptions = null;

  await axios
    .put(`${static.API_URL}${static.API_CATEGORY_PATH}/${id}`, {
      name: name,
      description: description
    })
    .then((res) => res.data)
    .then(async (data) => {
      if(data.statusCode == 200) {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_SUCCESS, data.message);        
      }
      else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message)
      }

      await req.flash('notyfOptions', notyfOptions);
      res.redirect('/admin/categories');
    })
    .catch((err) => console.log(err));
};

exports.deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  let notyfOptions = null;

  await axios
    .delete(`${static.API_URL}${static.API_CATEGORY_PATH}/${id}`)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_SUCCESS, data.message);
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      await req.flash('notyfOptions', notyfOptions);
      res.redirect('/admin/categories');
    })
    .catch((err) => console.log(err));
};
