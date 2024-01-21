const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/reviews.js");

//Reviews
//Post route
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

//Delete review route // make sure after completing project have to remove the delete button of review for non author//
router.delete("/:reviewId", isLoggedIn, isReviewAuthor ,wrapAsync(destroyReview));

module.exports = router;