const express = require('express');
const router = express.Router();
const index = require("../controllers/index");
const account = require("../controllers/account.controller");
const { checkAuthentication, checkAuthorization } = require('../middlewares/auth.middleware');

// GET sign in page.
router.get('/',account.returnSignInPage);

router.post('/', account.login);

module.exports = router;
