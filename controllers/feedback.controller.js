const { default: axios } = require("axios");
const qs = require("qs");
const static = require("../static");
const staticFunction = require("../staticFunction");

exports.returnFeedBackPage = async (req, res, next) => {
  let feedbacks = [];

  await axios
    .get(`${static.API_URL}${static.apiFeedbackPath}`)
    .then((res) => res.data)
    .then((data) => {
      console.log(data);
      if ((data.statusCode == 200) & (data.data !== null)) {
        feedbacks = data.data;

        res.render(`${static.VIEWS_PAGE_DIR}${static.feedbackDir}${static.feedbackView}`, {
          title: "Feedback",
          breadcrumb: staticFunction.initBreadcrumbOptions("Feedback", "Management", true),
          feedbacks: feedbacks,
          originalUrl: `${req.originalUrl}`,
        });
      }
    })
    .catch((err) => console.log(err));
};

exports.returnFeedBackDetailPage = async (req, res, next) => {
  const id = req.params.id;

  let feedback = null;

  await axios
    .get(`${static.API_URL}${static.apiFeedbackPath}/${id}`)
    .then((res) => res.data)
    .then((data) => {
      console.log(data);
      if (data.statusCode == 200) {
        feedback = data.data;

        res.render(`${static.VIEWS_PAGE_DIR}${static.feedbackDir}${static.feedbackDetailView}`, {
          title: feedback.id,
          breadcrumb: staticFunction.initBreadcrumbOptions("Feedback", feedback.id, true),
          feedback: feedback,
          originalUrl: `${req.originalUrl}`,
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
    .then((data) => {
      console.log(data);

      if (data.statusCode == 200) {
        feedback = data.data;

        res.redirect(req.originalUrl);

        // res.render(`${static.viewsPagesDir}${static.feedbackDir}${static.feedbackView}`, {
        //   title: "Feedback",
        //   breadcrumb: staticFunction.initBreadcrumbOptions("Feedback", ),
        //   feedback: feedback,
        //   currentPath: `${static.adminPath}${static.feedbackPath}`
        // });
      }
    })
    .catch((err) => console.log(err));
};

exports.deleteFeedback = async (req, res, next) => {
  let feedbacks = [];

  await axios
    .get(`${static.API_URL}${static.apiFeedbackPath}`)
    .then((res) => res.data)
    .then((data) => {
      console.log(data);
      if (data.length > 0) {
        feedbacks = data;
      }
    })
    .catch((err) => console.log(err));

  res.render(`${static.VIEWS_PAGE_DIR}${static.feedbackDir}${static.feedbackView}`, {
    title: "Feedback",
    breadcrumb: "Management",
    feedbacks: feedbacks,
    currentPath: `${static.ADMIN_PATH}${static.feedbackPath}`,
  });
};
