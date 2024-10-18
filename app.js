const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const { redirect } = require("express/lib/response");
const ejsMate = require("ejs-mate");

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
app.use(express.urlencoded({extended:true}))  // to enable url parsing
app.use(methodOverride("_method"));
app.engine("ejs",  ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// server listening at route "/"
app.get("/", (req,res)=>{
    res.send("hi, I am root");
});

app.get("/listings", async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("./Listings/index.ejs", {allListings});
})

app.get("/listings/new", (req,res)=>{
    res.render("./Listings/new.ejs");
})

app.post("/listings", async(req,res)=>{
    const newlisting = new Listing(req.body);
    newlisting.save();
    res.redirect("/listings");
})
app.get("/listings/:id",  async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    // console.log(listing);
    res.render("./Listings/show.ejs", {listing});
})

app.get("/listings/:id/edit", async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./Listings/edit.ejs", {listing});
})

app.put("/listings/:id", async(req,res)=>{
    const {id} = req.params;
    // console.log(id);
   await Listing.findByIdAndUpdate(id, req.body);
   res.redirect("/listings");
})

app.delete("/listings/:id", async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})
// app.get("/testListing", async(req, res)=>{
//     let sampleListing = new Listing({
//         title : "my new villa",
//         description : "By the beach",
//         price : 1200,
//         location: "Calangute, Goa",
//         country : "India"
//     })

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

// starting server
app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});