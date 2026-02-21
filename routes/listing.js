const express = require("express");
const router = express.Router();
const wrapAsync = require("../utill/wrapAsync");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const {index, renderNewForm, showdetailsofItem, postItem, editTheItem, updateTheItem, destroy}=require("../controllers/listingController.js");

//index route
router.route("/").get(
  wrapAsync(index),
).post(
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  postItem
);
router.get("/new", isLoggedIn, renderNewForm);
//New Route
router.route("/:id").get(
   showdetailsofItem).put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  updateTheItem
).delete(
  isLoggedIn,
  isOwner,
  destroy
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  editTheItem
);



module.exports = router;
