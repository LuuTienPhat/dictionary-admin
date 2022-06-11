const express = require('express');
const router = express.Router();
const authenticator = require("../middlewares/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");

/* GET users listing. */
router.get('/', dashboardController.returnDashboardPage);

module.exports = router;