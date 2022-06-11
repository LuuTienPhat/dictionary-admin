const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

router.get("/", orderController.returnOrderPage);

router.get("/:id", orderController.returnOrderDetailPage);

// router.get("/edit/:id", orderController.returnEditOrderPage);

router.post("/:id", orderController.updateOrder);

module.exports = router;