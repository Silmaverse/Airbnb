const express=require("express");
const router=express.Router();
const passport = require("passport");
const { savRedirectUrl } = require("../middleware");
const { signup, renderSignupForm, renderLogin, login, logout } = require("../controllers/usercontroller");


router.get("/signup" , renderSignupForm);

router.post("/signup", signup);


router.get("/login" ,renderLogin)

router.post("/login" , savRedirectUrl, passport.authenticate('local',{
    failureRedirect:"/login",
    failureFlash:true,
}), 
  login
)

router.get("/logout",logout);


module.exports=router;