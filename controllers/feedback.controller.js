const { default: axios } = require("axios");
const qs = require("qs");
const static = require("../static");
const staticFunc = require("../staticFunction");

const originalUrl = `${static.ADMIN_PATH}${static.feedbackPath}`;

exports.returnFeedBackPage = async (req, res, next) => {
  let { p } = req.query;
  let { s } = req.query;
  
  let feedbacks = [];
  let notyfOptions = null;
  let count = 58000;
  let perPage = 20;
  let offset = 0;
  let limit = 20;
  let total = 0;
  let search = "";
  let apiUrl = "";

  // if (p != null) {
  //   offset = parseInt(p) - 1;
  // }
  // apiUrl = `${static.API_URL}${static.API_CATEGORY_PATH}?offset=${offset}&limit=${limit}`;

  // if (s != null) {
  //   search = s;
  //   apiUrl = `${static.API_URL}${static.API_CATEGORY_PATH}?search=${encodeURIComponent(search)}`;
  // }


  let notyfOptionsFlash = await req.consumeFlash("notyfOptions");
  if (notyfOptionsFlash.length != 0) notyfOptions = notyfOptionsFlash[0];

  await axios
    .get(`${static.API_URL}${static.apiFeedbackPath}`)
    .then((res) => res.data)
    .then(async (data) => {
      console.log(data);
      if ((data.statusCode == 200) & (data.data !== null)) {
        feedbacks = data.data;

        res.render(`${static.VIEWS_PAGE_DIR}${static.feedbackDir}${static.feedbackView}`, {
          title: "Feedback",
          breadcrumb: staticFunc.initBreadcrumbOptions("Feedback", "Management", true),
          feedbacks: feedbacks,
          originalUrl: `${req.originalUrl}`,
          notyfOptions: notyfOptions,
          keyword: s != null ? search : "",
        });
      }
    })
    .catch((err) => console.log(err));
};

exports.returnFeedBackDetailPage = async (req, res, next) => {
  const id = req.params.id;
  let notyfOptions = null;
  let feedback = null;
  let notyfOptionsFlash = await req.consumeFlash("notyfOptions");
  if (notyfOptionsFlash.length != 0) notyfOptions = notyfOptionsFlash[0];

  await axios
    .get(`${static.API_URL}${static.apiFeedbackPath}/${id}`)
    .then((res) => res.data)
    .then(async (data) => {
      console.log(data);
      if (data.statusCode == 200) {
        feedback = data.data;

        res.render(`${static.VIEWS_PAGE_DIR}${static.feedbackDir}${static.feedbackDetailView}`, {
          title: `Feedback ${feedback.id}`,
          breadcrumb: staticFunc.initBreadcrumbOptions("Feedback", feedback.id, true),
          feedback: feedback,
          originalUrl: `${req.originalUrl}`,
          notyfOptions: notyfOptions,
        });
      }
    })
    .catch((err) => console.log(err));
};

exports.updateFeedback = async (req, res, next) => {
  const { id } = req.params;
  const { approved } = req.body;
  let feedback = null;

  await axios
    .put(`${static.API_URL}${static.apiFeedbackPath}/${id}`, {
      approved: approved,
    })
    .then((res) => res.data)
    .then(async (data) => {
      console.log(data);

      notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_SUCCESS, data.message);
    })
    .catch((err) => (notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message)));

  await req.flash("notyfOptions", notyfOptions);
  res.redirect(req.originalUrl);
};

exports.deleteFeedback = async (req, res, next) => {
  let feedbacks = [];

  await axios
    .get(`${static.API_URL}${static.apiFeedbackPath}`)
    .then((res) => res.data)
    .then((res) => res.data)
    .then(async (data) => {
      console.log(data);

      notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_SUCCESS, data.message);
    })
    .catch((err) => (notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message)));

  await req.flash("notyfOptions", notyfOptions);
  res.redirect(originalUrl);
};
