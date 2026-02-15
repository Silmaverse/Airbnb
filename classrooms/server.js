const express=require("express");
const app=express();
const path=require("path");
const session=require("express-session");
var flash = require('connect-flash');
app.set("view engine", "ejs");
app.set("views",path.join(__dirname , "views"));



app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next();
})

app.get("/register",(req,res)=>{
    let {name ="anonymous"}=req.query;
    req.session.name=name;
    if(name==="anonymous"){
       req.flash("error",'user not registered successfully');
       console.log(req.flash)

    }else{
       req.flash("success",'user registered successfully');
    }
    res.redirect("/hello")
    // res.send(name);
});

app.get("/hello",(req,res)=>{
    // res.locals.messages=req.flash
    res.render("page.ejs",{name:req.session.name});
})

app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send(`You sent a requset ${req.session.count} times`);
})

app.listen(3000 ,()=>{
    console.log("Server is listening  to 3000")
})