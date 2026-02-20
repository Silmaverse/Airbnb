const wrapAsync = require("../utill/wrapAsync");
const Listing = require("../models/listing");
const review = require("../models/review.js");

module.exports.createReview = wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  console.log("new review saved");
  req.flash("success", "Review  added Successfully");
  res.redirect(`/listings/${listing._id}`);
});

module.exports.destroyReview = wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted Successfully");
  res.redirect(`/listings/${id}`);
});
