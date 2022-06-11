const express = require('express');
const router = express.Router();
const partOfSpeechController = require("../controllers/partOfSpeech.controller");

router.get("/", partOfSpeechController.returnPartOfSpeechPage);

router.get("/:id", partOfSpeechController.returnPartOfSpeechDetailPage);

router.get("/add", partOfSpeechController.returnAddPartOfSpeechPage);

router.post("/add", partOfSpeechController.addPartOfSpeech);

router.get("/edit/:id", partOfSpeechController.returnEditPartOfSpeechPage);

router.post("/edit/:id", partOfSpeechController.updatePartOfSpeech);

module.exports = router;