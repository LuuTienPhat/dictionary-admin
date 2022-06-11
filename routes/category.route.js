const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const staticFunc = require('../staticFunction');

router.get("/", categoryController.returnCategoryPage);

router.get("/add", categoryController.returnAddCategoryPage);

router.post("/add", categoryController.addCategory);

router.get("/:id", categoryController.returnCategoryDetailPage);

router.get("/edit/:id", categoryController.returnEditCategoryPage);

router.post("/edit/:id", categoryController.updateCategory);

router.get("/delete/:id", categoryController.deleteCategory);

module.exports = router;
