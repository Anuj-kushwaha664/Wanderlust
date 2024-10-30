const express = require("express");
const router = express.Router({mergeParams : true}); // to merge parent route with child route
const wrapAsync = require("../util/wrapAsync.js");
const {isLoggedIn, isReviewAuthor, validateReview} = require("../middleware.js");
const { createReview, deleteReview } = require("../controllers/review.js");


// Review Routes
//Post review route
router.post("/reviews",isLoggedIn, validateReview, wrapAsync(createReview))

// Delete review route
router.delete("/reviews/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(deleteReview))

module.exports = router;