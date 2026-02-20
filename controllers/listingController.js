const Listing = require("../models/listing");
const wrapAsync = require("../utill/wrapAsync");

module.exports.index = async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showdetailsofItem = wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  console.log(listing);
  if (!listing) {
    req.flash("error", "Listing you requseted does not exist");
    res.redirect("/");
  }
  res.render("listings/show.ejs", { listing });
});

module.exports.postItem = wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  console.log(newListing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing created");
  // Listing.insertOne(newListing);
  res.redirect("/listings");
});

module.exports.editTheItem = wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

module.exports.updateTheItem = wrapAsync(async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
});

module.exports.destroy=wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
  })
