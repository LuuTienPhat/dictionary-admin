const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

router.get("/", productController.returnProductPage);

router.get("/add", productController.returnAddProductPage);

router.post("/add", productController.addProduct);

router.get("/:id", productController.returnProductDetailPage);

router.get("/edit/:id", productController.returnEditProductPage);

router.post("/edit/:id", productController.updateProduct);

module.exports = router;