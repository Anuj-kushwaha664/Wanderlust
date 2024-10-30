const initData = require("./data");
const mongoose =   require("mongoose");
const Listing = require("../models/listing");

// connection with database
main().then(()=>{
    console.log("connected to Db");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj, owner : "671a87320f60a2146713f235"
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();