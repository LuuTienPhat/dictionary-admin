const express = require('express');
const router = express.Router();
const profileController = require("../controllers/profile.controller");

router.get("/", profileController.returnProfilePage);

router.post("/", profileController.updateProfile);

module.exports = router;