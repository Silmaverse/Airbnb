const express= require("express");
const app= express();
const mongoose =require("mongoose");
const Listing=require("./models/listing")

main().then((res)=>{
    console.log(res)
}).catch((err)=>{
    console.log(err)
})

async function main() {
    
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.get("/" ,(req,res)=>{
     res.send("Hi I am root")
})

app.get("/testlisting", async(req,res)=>{

    let  sampletesting= new Listing({
        title:"My villa",
        description:"I like and decor my life",
        price:1000,
        location:"California ,USA",
        country:"USA"
    })

    await sampletesting.save();
    console.log("sample was saved");
    res.send("Successful testing");
})

app.listen(8080 ,(req,res)=>{
    console.log("server is listening")
})