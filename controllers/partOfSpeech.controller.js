const { default: axios } = require("axios");
const qs = require("qs");
const static = require("../static");
const { initBreadcrumbOptions } = require("../staticFunction");

exports.returnPartOfSpeechPage = async (req, res, next) => {
  let partOfSpeeches = [];

  await axios
    .get(`${static.API_URL}${static.apiPartOfSpeechPath}?limit=10`)
    .then((res) => res.data)
    .then((data) => {
      console.log(data);
      if (data.length > 0) {
        partOfSpeeches = data;
      }

      res.render(`${static.VIEWS_PAGE_DIR}${static.partOfSpeechDir}${static.partOfSpeechView}`, {
        title: "Part Of Speech",
        breadcrumb: "Management",
        partOfSpeeches: partOfSpeeches,
        originalUrl: `${req.originalUrl}`,
      });
    })
    .catch((err) => console.log(err));
};

exports.returnAddPartOfSpeechPage = (req, res, next) => {
  res.render(`${static.VIEWS_PAGE_DIR}${static.partOfSpeechDir}${static.addPartOfSpeechView}`, {
    title: "Part Of Speech",
    breadcrumb: initBreadcrumbOptions("New", true),
    originalUrl: `${req.originalUrl}`,
  });
};

exports.returnPartOfSpeechDetailPage = async (req, res, next) => {
  const id = req.params.id;
  let partOfSpeech = null;

  await axios
    .get(`${static.API_URL}${static.apiPartOfSpeechPath}/${id}`)
    .then((res) => res.data)
    .then((data) => {
      partOfSpeech = data.data;

      res.render(`${static.VIEWS_PAGE_DIR}${static.partOfSpeechDir}${static.partOfSpeechDetailView}`, {
        title: partOfSpeech.name,
        breadcrumb: initBreadcrumbOptions("Part of Speech", partOfSpeech.name, true),
        partOfSpeech: partOfSpeech,
        originalUrl: `${req.originalUrl}`,
      });
    })
    .catch((err) => console.log(err));
};

exports.returnEditPartOfSpeechPage = async (req, res, next) => {
  const id = req.params.id;
  let partOfSpeech = null;

  await axios
    .get(`${static.API_URL}${static.apiPartOfSpeechPath}/${id}`)
    .then((res) => res.data)
    .then((data) => {
      partOfSpeech = data.data;

      res.render(`${static.VIEWS_PAGE_DIR}${static.partOfSpeechDir}${static.editPartOfSpeechView}`, {
        title: partOfSpeech.name,
        breadcrumb: initBreadcrumbOptions("Part of Speech", partOfSpeech.name, true),
        partOfSpeech: partOfSpeech,
        originalUrl: `${req.originalUrl}`,
      });
    })
    .catch((err) => console.log(err));
};

exports.addPartOfSpeech = async (req, res, next) => {
  const { name } = req.body;

  await axios
    .post(`${static.API_URL}${static.apiPartOfSpeechPath}`, {
      name: name
    })
    .then((res) => res.data)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
};

exports.updatePartOfSpeech = async (req, res, next) => {
  const { id, name } = req.body;

  await axios
    .put(`${static.API_URL}${static.apiPartOfSpeechPath}/${id}`, {
      name: name
    })
    .then((res) => res.data)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
};

exports.deletePartOfSpeech = (req, res, next) => {};
