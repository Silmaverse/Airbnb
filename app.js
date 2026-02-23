if(process.env.NODE_ENV !="production"){
   require('dotenv').config() 
}
const express= require("express");
const app= express();
const mongoose =require("mongoose");
const ExpressError=require("./utill/ExpressError.js");
const path =require("path");
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const cookieParser=require("cookie-parser");
// router list start
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const userRouter=require("./routes/user.js")

const session=require("express-session");
const flash = require('connect-flash');

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


app.use(methodOverride('_method'));



app.set("view engine", "ejs");
app.set("views",path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname,"public")));

main().catch((err)=>{
    console.log(err)
})



async function main() {
    
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    console.log("connected to Db")
}

const  sessionOptions={
     secret:"mysupersecretstring",
     resave:false,
     saveUninitialized:true,
     cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
     }
}; 

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(cookieParser());




app.get("/getCookies" ,(req,res)=>{
    res.cookie("greet","assalumwalikum");
    res.cookie("madeIn","Bangladesh");
    res.send("Send you Cookies");
    

})

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})



app.use("/listings" ,listings);

//Reviews

app.use("/listings/:id/reviews" ,reviews);

app.use("/" ,userRouter);


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
app.listen(8080 ,(req,res)=>{
    console.log("server is listening")
})
