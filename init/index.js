const mongoose=require("mongoose");
const initdata= require("./data.js");
const Listing=require("../models/listing.js");
const maptoken=process.env.MAP_TOKEN
console.log(maptoken)

main().catch((err)=>{
    console.log(err)
})

async function main() {
    
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    console.log("connected to Db")
}

const initDB= async ()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj, owner:"6992f24ce4a819c8ad180d88",geometry:{type:"Point",coordinates:[90.4152,23.8041]}}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initDB()