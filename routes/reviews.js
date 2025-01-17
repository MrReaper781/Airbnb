const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../server.js");
const Listing = require("../models/listing.js");
const Reviews = require("../models/review.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(
      400,
      error.details.map((el) => el.message).join(", ")
    );
  } else {
    next();
  }
};

// Creating Listing Reviews
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let newReview = new Reviews(req.body.review);
    await newReview.save();
    let listing = await Listing.findById(id);
    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success", "New Review Added");
    res.redirect(`/listings/${id}`); // Fix template literal
  })
);

// Deleting Listing Reviews
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`); // Fix template literal
  })
);

module.exports = router;
