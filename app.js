const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");


// connection with database
main().then(()=>{
    console.log("connected to Db");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// server listening at route "/"
app.get("/", (req,res)=>{
    res.send("hi, I am root");
});

app.get("/listing", async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("./Listings/index.ejs", {allListings});
})

app.get("/testListing", async(req, res)=>{
    let sampleListing = new Listing({
        title : "my new villa",
        description : "By the beach",
        price : 1200,
        location: "Calangute, Goa",
        country : "India"
    })

    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing");
});

// starting server
app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});