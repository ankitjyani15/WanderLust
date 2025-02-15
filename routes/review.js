const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utilities/wrapAsync");
const Review = require("../models/review");
const Listing = require("../models/listing");
const ExpressError = require("../utilities/ExpressError");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
const reviewController = require("../controllers/review");



 // Reviews................................
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// Delete Reviews Route............................
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))

module.exports = router;