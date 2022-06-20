const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const multer = require('multer');

const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "Images");
    },
    filename: (req,file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage })

router.get("/", productController.returnProductPage);

router.post("/", upload.array('images', 12), productController.addProduct);

router.get("/add", productController.returnAddProductPage);

router.post("/add", productController.addProduct);

router.get("/:id", productController.returnProductDetailPage);

router.get("/edit/:id", productController.returnEditProductPage);

router.post("/edit/:id", productController.updateProduct);

router.get("/delete/:id", productController.deleteProduct);

module.exports = router;