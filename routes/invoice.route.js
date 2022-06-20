const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoice.controller");
const staticFunc = require('../staticFunction');

router.get("/", invoiceController.returnInvoicePage);

router.get("/add", invoiceController.returnAddInvoicePage);

router.post("/add", invoiceController.redirectAddInvoiceDetail);

router.get("/add/invoice-detail", invoiceController.returnAddInvoiceDetailPage);

router.post("/add/invoice-detail", invoiceController.updateInvoiceDetail);

router.get("/add/invoice-detail/delete/:productId", invoiceController.deleteInvoiceDetail);

router.get("/add/preview", invoiceController.returnPreviewInvoicePage);

router.get("/add/finish", invoiceController.addInvoice);

router.get("/:id", invoiceController.returnInvoiceDetailPage);

// router.get("/edit/:id", invoiceController.returnEditInvoicePage);

// router.post("/edit/:id", invoiceController.updateInvoice);

// router.get("/delete/:id", invoiceController.deleteInvoice);

module.exports = router;