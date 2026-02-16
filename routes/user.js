const express=require("express");
const router=express.Router();
const user=require("../models/user");
const wrapAsync = require("../utill/wrapAsync");


router.get("/signup" ,(req,res)=>{
    res.render("user/user.ejs");
})

router.post("/signup", wrapAsync(async(req,res)=>{
    try{

        let{email,username ,password}=req.body;
        const newUser=new user({email, username});
        const registeredUser=await user.register(newUser,password);
        req.flash("success","User registered successfully");
        res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/listings");
    }
}))

module.exports=router;