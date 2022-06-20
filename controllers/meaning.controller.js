const { default: axios } = require("axios");
const qs = require("qs");
const static = require("../static");
const staticFunc = require("../staticFunction");

const originalUrl = `${static.ADMIN_PATH}${static.MEANING_PATH}`;

exports.getMeaning = async (req, res, next) => {
  const id = req.params.id;
  let meaning = null;

  await axios
    .get(`${static.API_URL}${static.API_MEANING_PATH}/${id}`)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        meaning = data.data;
      }
      return res.status(200).json(meaning);
    })
    .catch((err) => console.log(err));
};


exports.addMeaning = async (req, res, next) => {
  const { partOfSpeechId, meaning, parentPath, vocabularyId } = req.body;
  let notyfOptions = null;

  await axios
    .post(`${static.API_URL}${static.API_MEANING_PATH}`, {
      enWord: {
        id: vocabularyId,
      },
      partOfSpeech: {
        id: partOfSpeechId,
      },
      meaning: meaning,
    })
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_SUCCESS, data.message);
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      await req.flash("notyfOptions", notyfOptions);
      res.redirect(parentPath);
    })
    .catch((err) => console.log(err));
};

exports.updateMeaning = async (req, res, next) => {
  const { id } = req.params;
  const { partOfSpeechId, meaning, parentPath } = req.body;
  let notyfOptions = null;

  await axios
    .put(`${static.API_URL}${static.API_MEANING_PATH}/${id}`, {
      meaning: meaning,
      partOfSpeech: {
        id: partOfSpeechId,
      },
    })
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_SUCCESS, data.message);
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      await req.flash("notyfOptions", notyfOptions);
      res.redirect(parentPath);
    })
    .catch((err) => console.log(err));
};

exports.deleteMeaning = async (req, res, next) => {
  const { id, vocabularyId } = req.params;
  let notyfOptions = null;

  await axios
    .delete(`${static.API_URL}${static.API_MEANING_PATH}/${id}`)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_SUCCESS, data.message);
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      await req.flash("notyfOptions", notyfOptions);
      res.redirect(`/admin/vocabularies/edit/${vocabularyId}`);
    })
    .catch((err) => console.log(err));
};
