const express = require('express');
const router = express.Router();
const mailController = require("../controllers/mail.controller");

router.get("/", mailController.returnSendMailPage);

router.post("/", mailController.sendMail);

module.exports = router;