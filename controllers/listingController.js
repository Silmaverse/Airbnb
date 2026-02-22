const Listing = require("../models/listing");
const wrapAsync = require("../utill/wrapAsync");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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
  let response=await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit:1,
    })
    .send()

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  let saveDListing=newListing.geometry=response.body.features[0].geometry;
  console.log(saveDListing)
  await newListing.save();
  req.flash("success", "New Listing created");
  // Listing.insertOne(newListing);
  res.redirect("/listings");
});

module.exports.editTheItem = wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  let originalImageurl = listing.image.url;
  originalImageurl = originalImageurl.replace("/upload", "/upload/h_300,w_250");
  console.log(originalImageurl);
  res.render("listings/edit.ejs", { listing, originalImageurl });
});

module.exports.updateTheItem = wrapAsync(async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
});

module.exports.destroy = wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
});
