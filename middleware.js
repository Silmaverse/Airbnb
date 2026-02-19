const Listing = require("./models/listing");
const review=require("./models/review");
const ExpressError=require("./utill/wrapAsync");
const {listingSchema ,reviewSchema}=require("./schema");


module.exports.isLoggedIn = (req, res, next) => {
  console.log(req);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be looged in to create listing ");
    return res.redirect("/login");
  }
  next();
};

module.exports.savRedirectUrl = (req, res, next) => {
  console.log("hi there");
  if (req.session.redirectUrl) {
    console.log("kya khabr hai");
    console.log(req.session.redirectUrl);
    res.locals.redirectUrl = req.session.redirectUrl;
    console.log(res.locals);
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission  to edit");
    return res.redirect(`/listings/${id}`);
  }
  next()
};


module.exports.validateListing=(req,res,next)=>{
   let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
   let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.isreviewAuthor = async (req, res, next) => {
  let {id, reviewId } = req.params;
  let reviewowner = await review.findById(reviewId);
  if (!reviewowner.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next()
};