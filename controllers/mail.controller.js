const { default: axios } = require("axios");
const qs = require("qs");
const static = require("../static");
const staticFunction = require("../staticFunction");

exports.returnSendMailPage = async (req, res, next) => {
  res.render(`${static.VIEWS_PAGE_DIR}${static.MAIL_DIR}${static.MAIL_VIEW}`, {
    title: "Mail",
    breadcrumb: staticFunction.initBreadcrumbOptions("Mail", "Send Mail", false),
    originalUrl: `${req.originalUrl}`,
    notyfOptions: null,
  });
};

exports.sendMail = async (req, res, next) => {
  const { email, subject, body } = req.body;
  await axios
    .post(`${static.API_URL}${static.API_MAIL_PATH}`, {
      email: email,
      subject: subject,
      body: body,
    })
    .then((res) => res.data)
    .then((data) => {
      console.log(data);
      let notyfOptions = null;

      if (data.statusCode == 200) notyfOptions = staticFunction.initNotyfOptions(static.NOTYF_SUCCESS, data.message);
      else notyfOptions = staticFunction.initNotyfOptions(static.NOTYF_DANGER, data.message);

      return res.render(`${static.VIEWS_PAGE_DIR}${static.MAIL_DIR}${static.MAIL_VIEW}`, {
        title: "Mail",
        breadcrumb: staticFunction.initBreadcrumbOptions("Mail", "Send Mail", false),
        originalUrl: `${req.originalUrl}`,
        notyfOptions: notyfOptions,
      });
    })
    .catch((err) => console.log(err));
};

exports.returnMailPage = async (req, res, next) => {
  let feedbacks = [];

  await axios
    .get(`${static.API_URL}${static.API_MAIL_PATH}`)
    .then((res) => res.data)
    .then((data) => {
      console.log(data);
      if ((data.statusCode == 200) & (data.data !== null)) {
        feedbacks = data.data;

        res.render(`${static.VIEWS_PAGE_DIR}${static.MAIL_DIR}${static.MAIL_VIEW}`, {
          title: "Feedback",
          breadcrumb: staticFunction.initBreadcrumbOptions("Feedback", "Management", true),
          feedbacks: feedbacks,
          originalUrl: `${req.originalUrl}`,
        });
      }
    })
    .catch((err) => console.log(err));
};
