const dotenv =require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const mongoose=require("mongoose");
const initdata= require("./data.js");
const Listing=require("../models/listing.js");
const User=require("../models/user.js")
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
    const user = new User({
      username: "admin",
      email: "admin@gmail.com"
    });
    
    const registeredUser = await User.register(user, "123456");
    initdata.data=initdata.data.map((obj)=>({...obj, owner:registeredUser._id}));
    await Listing.insertMany(initdata.data);
    console.log(initdata.data)
    console.log("data was initialized");
}

initDB()