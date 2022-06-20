const express = require("express");
const router = express.Router();
const meaningController = require("../controllers/meaning.controller");
const staticFunc = require('../staticFunction');

router.get("/:id", meaningController.getMeaning);

router.post("/:id", meaningController.addMeaning);

router.put("/:id", meaningController.updateMeaning);

router.delete("/:id", meaningController.deleteMeaning);


module.exports = router;
