const express= require("express");
const app= express();
const mongoose =require("mongoose");
const ExpressError=require("./utill/ExpressError.js");
const path =require("path");
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const cookieParser=require("cookie-parser");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
app.use(methodOverride('_method'));

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

app.use(cookieParser());

app.get("/" ,(req,res)=>{
     res.send("Hi I am root")
})

app.get("/getCookies" ,(req,res)=>{
    res.cookie("greet","assalumwalikum");
    res.cookie("madeIn","Bangladesh");
    res.send("Send you Cookies");
    

})

app.use("/listings" ,listings);

//Reviews

app.use("/listings/:id/reviews" ,reviews);

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
