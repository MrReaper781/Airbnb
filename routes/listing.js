const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../server.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js"); // Corrected naming of the middleware

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(
      400,
      error.details.map((el) => el.message).join(", ")
    );
  }
  next();
};

// Route to Display Title
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListing = await Listing.find({});
    res.render("listings/index", { allListing });
  })
);

// New Route to add new details
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

// Route to display details of a specific id
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let showListing = await Listing.findById(id).populate("reviews");
    if (!showListing) {
      req.flash("error", "Listing does not exist");
      return res.redirect("/listings");
    }
    res.render("listings/show", { showListing });
  })
);

// Create Route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let editListing = await Listing.findById(id);
    if (!editListing) {
      req.flash("error", "Listing does not exist");
      return res.redirect("/listings");
    }
    res.render("listings/edit", { editListing });
  })
);

// Update Route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, {
      runValidators: true,
      new: true,
    });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
