const express = require("express");
const router = express.Router();
const apiController = require("../controllers/api.controller");
const meaningController = require("../controllers/meaning.controller");
const exampleController = require("../controllers/example.controller");
const partOfSpeechController = require("../controllers/partOfSpeech.controller");
const staticFunc = require('../staticFunction');

router.get("/partOfSpeeches",partOfSpeechController.getPartOfSpeeches);

router.get("/meanings/:id", meaningController.getMeaning);

router.post("/meanings/", meaningController.addMeaning);

router.post("/meanings/edit/:id", meaningController.updateMeaning);

router.get("/meanings/delete/:vocabularyId/:id", meaningController.deleteMeaning);

router.post("/examples", exampleController.addExample);

router.get("/examples/:id", exampleController.getExample);

router.post("/examples/edit/:id", exampleController.updateExample);

router.get("/examples/delete/:vocabularyId/:id", exampleController.deleteExample);

router.get("/chart/sales-chart", apiController.returnSalesChart);

router.get("/chart/orders-chart", apiController.returnOrdersChart);

module.exports = router;