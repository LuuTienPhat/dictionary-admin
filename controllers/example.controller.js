const { default: axios } = require("axios");
const qs = require("qs");
const static = require("../static");
const staticFunc = require("../staticFunction");

const originalUrl = `${static.ADMIN_PATH}${static.EXAMPLE_PATH}`;

exports.getExample = async (req, res, next) => {
  const id = req.params.id;
  let example = null;

  await axios
    .get(`${static.API_URL}${static.API_EXAMPLE_PATH}/${id}`)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        example = data.data;
      }
      return res.status(200).json(example);
    })
    .catch((err) => console.log(err));
};

exports.addExample = async (req, res, next) => {
  const { meaningId, example, exampleMeaning, parentPath } = req.body;
  let notyfOptions = null;

  await axios
    .post(`${static.API_URL}${static.API_EXAMPLE_PATH}`, {
      example: example,
      exampleMeaning: exampleMeaning,
      meaning: {
        id: meaningId,
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

exports.updateExample = async (req, res, next) => {
  const { id } = req.params;
  const { meaningId, exampleId, example, exampleMeaning, parentPath } = req.body;
  let notyfOptions = null;

  await axios
    .put(`${static.API_URL}${static.API_EXAMPLE_PATH}/${id}`, {
      example: example,
      exampleMeaning: exampleMeaning,
      id: exampleId,
      meaning: {
        id: meaningId,
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

exports.deleteExample = async (req, res, next) => {
  const { id, vocabularyId } = req.params;
  let notyfOptions = null;

  await axios
    .delete(`${static.API_URL}${static.API_EXAMPLE_PATH}/${id}`)
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
