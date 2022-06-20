const { default: axios } = require("axios");
const qs = require("qs");
const static = require("../static");
const staticFunc = require("../staticFunction");

const originalUrl = `${static.ADMIN_PATH}${static.USER_PATH}`;

exports.returnUserPage = async (req, res, next) => {
  let { p } = req.query;
  let { s } = req.query;

  let users = [];
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
  apiUrl = `${static.API_URL}${static.API_USER_PATH}?offset=${offset}&limit=${limit}`;

  if (s != null) {
    search = s;
    apiUrl = `${static.API_URL}${static.API_USER_PATH}?search=${encodeURIComponent(search)}`;
  }

  await axios.get(`${static.API_URL}${static.API_USER_PATH}${static.API_COUNT_PATH}`).then((res) => (total = res.data.data));

  await axios
    .get(apiUrl)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        users = data.data;
        count = users.length;
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      if (s != null) total = users.length;

      notyfOptionsFlash = await req.consumeFlash("notyfOptions");
      if (notyfOptionsFlash.length != 0) notyfOptions = notyfOptionsFlash[0];
    })
    .catch((err) => console.log(err));

  res.render(`${static.VIEWS_PAGE_DIR}${static.USER_DIR}${static.USER_VIEW}`, {
    title: "Users",
    breadcrumb: staticFunc.initBreadcrumbOptions("Users", "Management", false),
    users: users,
    notyfOptions: notyfOptions,
    originalUrl: originalUrl,
    pagination: staticFunc.initPagination(perPage, total, count, Math.ceil(total / perPage), offset + 1),
    keyword: s != null ? search : "",
    modal: { content: static.DELETE_USER_QUESTION },
  });
};

exports.returnAddUserPage = (req, res, next) => {
  let user = null;

  res.render(`${static.VIEWS_PAGE_DIR}${static.USER_DIR}${static.EDIT_USER_VIEW}`, {
    title: "Add User",
    breadcrumb: staticFunc.initBreadcrumbOptions("Users", "New", true),
    notyfOptions: null,
    originalUrl: originalUrl,
    user: user,
    type: 'add',
  });
};

exports.returnUserDetailPage = async (req, res, next) => {
  const id = req.params.id;
  let user = null;

  await axios
    .get(`${static.API_URL}${static.API_USER_PATH}/${id}`)
    .then((res) => res.data)
    .then((data) => {
      user = data.data;

      res.render(`${static.VIEWS_PAGE_DIR}${static.USER_DIR}${static.USER_DETAIL_VIEW}`, {
        title: user.id,
        breadcrumb: staticFunc.initBreadcrumbOptions("User", user.id, true),
        user: user,
        notyfOptions: null,
        originalUrl: originalUrl,
      });
    })
    .catch((err) => console.log(err));
};

exports.returnEditUserPage = async (req, res, next) => {
  const id = req.params.id;
  let user = null;
  let notyfOptionsFlash = await req.consumeFlash("notyfOptions");

  await axios
    .get(`${static.API_URL}${static.API_USER_PATH}/${id}`)
    .then((res) => res.data)
    .then(async (data) => {
      user = data.data;

      res.render(`${static.VIEWS_PAGE_DIR}${static.USER_DIR}${static.EDIT_USER_VIEW}`, {
        title: user.id,
        breadcrumb: staticFunc.initBreadcrumbOptions("User", user.id, true),
        user: user,
        type: 'edit',
        notyfOptions: notyfOptionsFlash.length != 0 ? notyfOptionsFlash[0] : null,
        originalUrl: `${req.originalUrl}`,
      });
    })
    .catch((err) => console.log(err));
};

exports.addUser = async (req, res, next) => {
  const { firstname, lastname, birthday, phone, email, gender, address, roleId, username, password } = req.body;
  let notyfOptions = null;
  // const roles = [{
  //   id : roleId
  // }]

  await axios
    .post(
      `${static.API_URL}${static.API_USER_PATH}`,
      {
        firstname: firstname,
        lastname: lastname,
        phone: phone,
        birthday: birthday,
        email: email,
        gender: gender,
        address: address,
        username: username,
        password: password,
        roleId: roleId
      },
      staticFunc.axiosOptions(req),
    )
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_SUCCESS, data.message);
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      await req.flash("notyfOptions", notyfOptions);
      res.redirect("/admin/users");
    })
    .catch((err) => console.log(err));
};

exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { firstname, lastname, birthday, phone, email, gender, address, roleId } = req.body;

  const roles = [{
    id : roleId
  }]

  let notyfOptions = null;

  await axios
    .put(
      `${static.API_URL}${static.API_USER_PATH}/${id}`,
      {
        firstname: firstname,
        lastname: lastname,
        birthday: birthday,
        phone: phone,
        email: email,
        gender: gender,
        address: address,
        roles: roles
      },
      staticFunc.axiosOptions(req),
    )
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_SUCCESS, data.message);
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      await req.flash("notyfOptions", notyfOptions);
      res.redirect(`${req.originalUrl}`);
    })
    .catch((err) => console.log(err));
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  let notyfOptions = null;

  await axios
    .delete(`${static.API_URL}${static.API_USER_PATH}/${id}`)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_SUCCESS, data.message);
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      await req.flash("notyfOptions", notyfOptions);
      res.redirect("/admin/users");
    })
    .catch((err) => console.log(err));
};
