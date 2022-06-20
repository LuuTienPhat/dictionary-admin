const { default: axios } = require("axios");
const qs = require("qs");
const static = require("../static");
const staticFunc = require("../staticFunction");
const { initBreadcrumbOptions } = require("../staticFunction");

const originalUrl = `${static.ADMIN_PATH}${static.partOfSpeechPath}`;

exports.returnPartOfSpeechPage = async (req, res, next) => {
  let { p } = req.query;
  let { s } = req.query;

  let partOfSpeeches = [];
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
  apiUrl = `${static.API_URL}${static.apiPartOfSpeechPath}?offset=${offset}&limit=${limit}`;

  if (s != null) {
    search = s;
    apiUrl = `${static.API_URL}${static.partOfSpeechPath}?search=${encodeURIComponent(search)}`;
  }

  await axios.get(`${static.API_URL}${static.apiPartOfSpeechPath}${static.API_COUNT_PATH}`).then((res) => (total = res.data.data));

  await axios
    .get(apiUrl)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        partOfSpeeches = data.data;
        count = partOfSpeeches.length;
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      if(s != null ) total = partOfSpeeches.length;

      notyfOptionsFlash = await req.consumeFlash('notyfOptions');
      if(notyfOptionsFlash.length != 0) notyfOptions = notyfOptionsFlash[0];
    })
    .catch((err) => console.log(err));

    res.render(`${static.VIEWS_PAGE_DIR}${static.partOfSpeechDir}${static.partOfSpeechView}`, {
      title: "Part of Speeches",
      breadcrumb: staticFunc.initBreadcrumbOptions("Part of Speeches", "Management", false),
      partOfSpeeches: partOfSpeeches,
      notyfOptions: notyfOptions,
      originalUrl: originalUrl,
      pagination: staticFunc.initPagination(perPage, total, count, Math.ceil(total / perPage), offset + 1),
      keyword: s != null ? search : "",
      modal: {content: static.DELETE_PART_OF_SPEECH_QUESTION},
    });
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

exports.getPartOfSpeeches = async (req, res, next) => {
  let partOfSpeeches = [];

  await axios
    .get(`${static.API_URL}${static.apiPartOfSpeechPath}`)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        partOfSpeeches = data.data;
      }
      return res.status(200).json(partOfSpeeches);
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
