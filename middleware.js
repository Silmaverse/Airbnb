module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req)
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        console.log(req.session.redirectUrl);
        req.flash("error","you must be looged in to create listing ");
        return res.redirect("/login");
    }
    next();
}

module.exports.savRedirectUrl=(req,res,next)=>{
    console.log("hi there")
    if(req.session.redirectUrl){
        console.log("kya khabr hai")
        console.log(req.session.redirectUrl);
        res.locals.redirectUrl=req.session.redirectUrl;
        console.log(res.locals)
    }
    next();
}