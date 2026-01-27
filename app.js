const express= require("express");
const app= express();
const mongoose =require("mongoose");
const Listing=require("./models/listing")
const path =require("path");
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');

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

//index route

app.get("/listings" , async(req,res)=>{
    const alllistings=await Listing.find({});
    res.render("listings/index.ejs" , {alllistings});
})

//New Route

app.get("/listings/new" ,(req,res)=>{
    res.render("listings/new.ejs");
})



//Show route

app.get("/listings/:id" ,async(req,res)=>{
    let {id} =req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs" ,{listing})

})

//Post Route
app.post("/listings" , async(req,res)=>{
    const newListing =new Listing(req.body.listing);
    await newListing.save()
    res.redirect("/listings");
})

//Edit Route
app.get("/listings/:id/edit" ,async(req ,res)=>{
    let {id} =req.params;
    const listing=await Listing.findById(id);
    console.log(listing)
    res.render("listings/edit.ejs",{listing})
})

//update route
app.put("/listings/:id" ,async(req,res)=>{
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id ,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//destroy route
app.delete("/listings/:id",async(req,res)=>{
    let {id} =req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})


app.listen(8080 ,(req,res)=>{
    console.log("server is listening")
})