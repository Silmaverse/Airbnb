const express= require("express");
const app= express();
const mongoose =require("mongoose");
const Listing=require("./models/listing");
const wrapAsync=require("./utill/wrapAsync.js");
const ExpressError=require("./utill/ExpressError.js");
const path =require("path");
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const listingSchema=require("./schema.js");
const { error } = require("console");
const review=require("./models/review.js")
app.use(methodOverride('_method'))

main().then((res)=>{
    console.log(res)
}).catch((err)=>{
    console.log(err)
})

app.set("view engine", "ejs");
app.set("views",path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"public")));


async function main() {
    
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.get("/" ,(req,res)=>{
     res.send("Hi I am root")
})

const validateListing=(req,res,next)=>{
   let result=listingSchema.validate(req.body);
    if(result.error){
        let errMsg=error.details.map((el)=>el.message.join(","));
        throw new ExpressError(400, result.error);
    }else{
        next();
    }
}

//index route

app.get("/listings" , wrapAsync(async(req,res)=>{
    const alllistings=await Listing.find({});
    res.render("listings/index.ejs" , {alllistings});
}))

//New Route

app.get("/listings/new" ,(req,res)=>{
    res.render("listings/new.ejs");
})



//Show route

app.get("/listings/:id" ,wrapAsync(async(req,res)=>{
    let {id} =req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs" ,{listing})

}))

//Create(post) Route
app.post("/listings" , validateListing,wrapAsync(async(req,res)=>{
    
    const newListing =new Listing(req.body.listing);
    await newListing.save();
    // Listing.insertOne(newListing);
    res.redirect("/listings");
    
}))

//Edit Route
app.get("/listings/:id/edit" ,wrapAsync(async(req ,res)=>{
    let {id} =req.params;
    const listing=await Listing.findById(id);
    console.log(listing)
    res.render("listings/edit.ejs",{listing})
}))

//update route
app.put("/listings/:id",validateListing ,wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing")
    }
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id ,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

//destroy route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} =req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//Reviews
//POST ROUTE
app.post("/listings/:id/reviews" ,async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new review(req.body.review);
    console.log(newReview)
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`)
})


app.listen(8080 ,(req,res)=>{
    console.log("server is listening")
})

app.all("/*splat",(req,res,next)=>{
    console.log("invalid path")
    next(new ExpressError(404,"Page Not Found"));
});    

app.use((err,req,res,next)=>{
    let{statusCode =500 ,message="Something Went Wrong"}=err;
    console.log(err)
    res.status(statusCode).render("Error/Error.ejs",{message,statusCode});
    // res.status(statusCode).send(message);
})    
