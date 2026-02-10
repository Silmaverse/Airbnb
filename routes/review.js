const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utill/wrapAsync");
const Listing=require("../models/listing");
const review=require("../models/review.js");
const {listingSchema , reviewSchema}=require("../schema.js");
const ExpressError=require("../utill/ExpressError.js");

const validateReview=(req,res,next)=>{
   let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//Reviews
//Review POST ROUTE
router.post("/", validateReview ,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new review(req.body.review);
    console.log(newReview)
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`)
}))

// Delete Review Route
router.delete("/:reviewId" , wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))

module.exports=router;