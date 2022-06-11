const express = require('express');
const router = express.Router();
const feedbackController = require("../controllers/feedback.controller");

router.get("/", feedbackController.returnFeedBackPage);

router.get("/:id", feedbackController.returnFeedBackDetailPage);

router.post("/:id", feedbackController.updateFeedback);

// router.post("/edit/:id", feedbackController.updateFeedback);

// router.get("/edit/:id", feedbackController.returnFeedBackDetailPage);

module.exports = router;