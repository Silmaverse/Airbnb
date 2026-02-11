const express=require("express");
const router=express.Router();
const wrapAsync=require("../utill/wrapAsync");
const Listing=require("../models/listing");
const {listingSchema }=require("../schema.js");
const ExpressError=require("../utill/ExpressError.js");

const validateListing=(req,res,next)=>{
   let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//index route

router.get("/" , wrapAsync(async(req,res)=>{
    const alllistings=await Listing.find({});
    res.render("listings/index.ejs" , {alllistings});
}))

//New Route

router.get("/new" ,(req,res)=>{
    res.render("listings/new.ejs");
})



//Show route

router.get("/:id" ,wrapAsync(async(req,res)=>{
    let {id} =req.params;
    const listing=await Listing.findById(id).populate('reviews');
    res.render("listings/show.ejs" ,{listing})

}))

//Create(post) Route
router.post("/" , validateListing,wrapAsync(async(req,res)=>{
    
    const newListing =new Listing(req.body.listing);
    await newListing.save();
    // Listing.insertOne(newListing);
    res.redirect("/listings");
    
}))

//Edit Route
router.get("/:id/edit" ,wrapAsync(async(req ,res)=>{
    let {id} =req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
}))

//update route
router.put("/:id",validateListing ,wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing")
    }
    let {id} =req.params;
    console.log(req.body)
    await Listing.findByIdAndUpdate(id ,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

//destroy route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} =req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


module.exports=router;

