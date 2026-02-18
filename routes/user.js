const express=require("express");
const router=express.Router();
const user=require("../models/user");
const wrapAsync = require("../utill/wrapAsync");
const passport = require("passport");


router.get("/signup" ,(req,res)=>{
    res.render("user/signup.ejs");
});

router.post("/signup", wrapAsync(async(req,res)=>{
    try{

        let{email,username ,password}=req.body;
        const newUser=new user({email, username});
        const registeredUser=await user.register(newUser,password);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","User registered successfully");
            res.redirect("/listings");
        })
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));


router.get("/login" ,(req,res)=>{
    res.render("user/login.ejs")
})

router.post("/login" , passport.authenticate('local',{
    failureRedirect:"/login",
    failureFlash:true,
}), async(req,res)=>{
    req.flash("success","Welcome to Wanderlust");
    res.redirect("/listings");
}

)

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
         return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
});


module.exports=router;