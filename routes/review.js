const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  validateReview,
  isLoggedIn,
  isreviewAuthor,
} = require("../middleware.js");
const {createReview, destroyReview}=require("../controllers/reviewController.js");


//Reviews
//Review POST ROUTE
router.post(
  "/",
  isLoggedIn,
  validateReview,
  createReview
);

// Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isreviewAuthor,
  destroyReview
);

module.exports = router;
