const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const staticFunc = require('../staticFunction');

router.get("/", userController.returnUserPage);

router.get("/add", userController.returnAddUserPage);

router.post("/", userController.addUser);

router.get("/:id", userController.returnUserDetailPage);

router.get("/edit/:id", userController.returnEditUserPage);

router.post("/edit/:id", userController.updateUser);

router.get("/delete/:id", userController.deleteUser);

module.exports = router;
