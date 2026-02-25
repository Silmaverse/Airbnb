const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });
const mongoose=require("mongoose");
const initdata= require("./data.js");
const Listing=require("../models/listing.js");
const dbUrl=process.env.ATLASDB_URL



async function main() {
    
    await mongoose.connect(dbUrl);
}
main().then(()=>{
    console.log("connected to Db")
  
}).catch((err)=>{
    console.log(err)
})

const initDB= async ()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj, owner:"6992f24ce4a819c8ad180d88"}));
    await Listing.insertMany(initdata.data);
    console.log(initdata.data)
    console.log("data was initialized");
}

initDB()