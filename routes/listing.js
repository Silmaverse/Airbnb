const express = require("express");
const router = express.Router();
const wrapAsync = require("../utill/wrapAsync");
const Listing = require("../models/listing");
const ExpressError = require("../utill/ExpressError.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const {index, renderNewForm, showdetailsofItem, postItem, editTheItem, updateTheItem, destroy}=require("../controllers/listingController.js");

//index route

router.get(
  "/",
  wrapAsync(index),
);

//New Route

router.get("/new", isLoggedIn, renderNewForm);

//Show route

router.get(
  "/:id", showdetailsofItem);

//Create(post) Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  postItem
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  editTheItem
);

//update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  updateTheItem
);

//destroy route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  destroy
);

module.exports = router;
