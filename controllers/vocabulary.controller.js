const { default: axios } = require("axios");
const qs = require("qs");
const static = require("../static");
const staticFunc = require("../staticFunction");

const originalUrl = `${static.ADMIN_PATH}${static.VOCABULARY_PATH}`;

exports.returnVocabularyPage = async (req, res, next) => {
  let { p } = req.query;
  let { s } = req.query;

  let vocabularies = [];
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
  apiUrl = `${static.API_URL}${static.API_VOCABULARY_PATH}?offset=${offset}&limit=${limit}`;

  if (s != null) {
    search = s;
    apiUrl = `${static.API_URL}${static.API_VOCABULARY_PATH}?search=${search}`;
  }

  await axios.get(`${static.API_URL}${static.API_VOCABULARY_PATH}${static.API_COUNT_PATH}`).then((res) => (total = res.data.data));

  await axios
    .get(apiUrl)
    .then((res) => res.data)
    .then(async (data) => {
      console.log(data);
      if (data.statusCode == 200) {
        vocabularies = data.data;
        count = vocabularies.length;
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      if(s != null ) total = vocabularies.length;

      notyfOptionsFlash = await req.consumeFlash('notyfOptions');
      if(notyfOptionsFlash.length != 0) notyfOptions = notyfOptionsFlash[0];
    })
    .catch((err) => console.log(err));

    res.render(`${static.VIEWS_PAGE_DIR}${static.VOCABULARY_DIR}${static.VOCABULARY_VIEW}`, {
      title: "Vocabularies",
      breadcrumb: staticFunc.initBreadcrumbOptions("Vocabularies", "Management", false),
      vocabularies: vocabularies,
      notyfOptions: notyfOptions,
      originalUrl: originalUrl,
      pagination: staticFunc.initPagination(perPage, total, count, Math.ceil(total / perPage), offset + 1),
      keyword: s != null ? search : "",
      modal: {content: static.DELETE_VOCABULARY_QUESTION}
    });
}

exports.returnAddVocabularyPage = async (req, res, next) => {
  res.render(`${static.VIEWS_PAGE_DIR}${static.VOCABULARY_DIR}${static.ADD_VOCABULARY_VIEW}`, {
    title: "Add Vocabulary",
    breadcrumb: staticFunc.initBreadcrumbOptions("Vocabularies", "New", true),
    notyfOptions: null,
    originalUrl: originalUrl,
  });
};

exports.returnVocabularyDetailPage = async (req, res, next) => {
  const id = req.params.id;
  let vocabulary = null;

  await axios
    .get(`${static.API_URL}${static.API_VOCABULARY_PATH}/${id}`)
    .then((res) => res.data)
    .then(async (data) => {
      vocabulary = data.data;

      res.render(`${static.VIEWS_PAGE_DIR}${static.VOCABULARY_DIR}${static.VOCABULARY_DETAIL_VIEW}`, {
        title: vocabulary.name,
        breadcrumb: staticFunc.initBreadcrumbOptions("Vocabulary", vocabulary.id, true),
        vocabulary: vocabulary,
        notyfOptions: null,
        originalUrl: originalUrl,
      });
    })
    .catch((err) => console.log(err));
};

exports.returnEditVocabularyPage = async (req, res, next) => {
  res.render(`${static.VIEWS_PAGE_DIR}${static.VOCABULARY_DIR}${static.EDIT_VOCABULARY_VIEW}`, {
    title: "Vocabulary Management",
    breadcrumb: "Edit ",
  });
};

exports.addVocabulary = async (req, res, next) => {
  const {word, pronunciation} = req.body;

  axios
    .post(`${static.API_URL}${static.API_VOCABULARY_PATH}`, {
      word: word,
      pronunciation: pronunciation
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
      res.redirect(originalUrl);
    })
    .catch((err) => console.log(err));
};

exports.updateVocabulary = async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;
  let notyfOptions = null;

  await axios
    .put(`${static.API_URL}${static.API_VOCABULARY_PATH}/${id}`, {
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
      res.redirect(originalUrl);
    })
    .catch((err) => console.log(err));
};

exports.deleteVocabulary = async (req, res, next) => {
  const { id } = req.params;
  let notyfOptions = null;

  await axios
    .delete(`${static.API_URL}${static.API_VOCABULARY_PATH}/${id}`)
    .then((res) => res.data)
    .then(async (data) => {
      if(data.statusCode == 200) {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_SUCCESS, data.message);
      }
      else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      await req.flash('notyfOptions', notyfOptions);
      res.redirect(originalUrl);

    })
    .catch((err) => console.log(err));
};
