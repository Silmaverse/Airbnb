const wrapAsync = require("../utill/wrapAsync");


module.exports.renderSignupForm=(req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signup=wrapAsync(async(req,res)=>{
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
})



module.exports.renderLogin=(req,res)=>{
    res.render("user/login.ejs")
}


module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to Wanderlust");
    console.log(res.locals);
    res.locals.redirectUrl?res.redirect(res.locals.redirectUrl):res.redirect("/listings");
    // res.redirect(res.locals.redirectUrl);
}


module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
         return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
}