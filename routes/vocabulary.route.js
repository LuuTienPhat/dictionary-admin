const express = require('express');
const router = express.Router();
const vocabularyController = require("../controllers/vocabulary.controller");

router.get("/", vocabularyController.returnVocabularyPage);

router.get("/add", vocabularyController.returnAddVocabularyPage);

router.post("/add", vocabularyController.addVocabulary);

router.get("/edit/:id", vocabularyController.returnEditVocabularyPage);

router.post("/edit/:id", vocabularyController.updateVocabulary);

router.get("/delete/:id", vocabularyController.deleteVocabulary);

router.get("/:id", vocabularyController.returnVocabularyDetailPage);


module.exports = router;