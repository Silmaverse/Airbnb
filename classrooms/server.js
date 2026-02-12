const express=require("express");
const app=express();
const session=require("express-session");

const  sessionOptions={
     secret:"mysupersecretstring",
     reasve:false,
     saveUninitialized:true,
}; 

app.use(session(sessionOptions));

app.get("/register",(req,res)=>{
    let {name ="anonymous"}=req.query;
    req.session.name=name;
    console.log(req.session.name);
    res.redirect("/hello")
    // res.send(name);
});

app.get("/hello",(req,res)=>{
    res.send(`Hello ${req.session.name} how are you`)
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