const express = require("express");
const {
  reviewListing,
  reviewForm,
  reviewDelete,
} = require("../controllers/reviewController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.route("/").get(reviewListing).post(reviewForm);
router.delete("/:id", reviewDelete);
module.exports = router;
