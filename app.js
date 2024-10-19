const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const { redirect } = require("express/lib/response");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./util/wrapAsync.js");
const ExpressError = require("./util/ExpressError.js");
const {listingSchema} = require("./schema.js");

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

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error)
    }else{
        next();
    }
}

app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("./Listings/index.ejs", {allListings});
}));

app.get("/listings/new", (req,res)=>{
    res.render("./Listings/new.ejs");
})

// create route
app.post("/listings", validateListing, wrapAsync(async(req,res,next)=>{  // handling error using wrapAsync function because try catch is bulky
        const newlisting = new Listing(req.body);
        await newlisting.save();
        res.redirect("/listings")
})) 

// show route
app.get("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    // console.log(listing);
    res.render("./Listings/show.ejs", {listing});
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./Listings/edit.ejs", {listing});
}));

app.put("/listings/:id",wrapAsync(async(req,res)=>{
    if(Object.keys(req.body).length==0){
        throw new ExpressError(404, "Send Valid data for listing")
    }
    const {id} = req.params;
    // console.log(id);
   await Listing.findByIdAndUpdate(id, req.body);
   res.redirect("/listings");
}));

app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.all("*", (req,res,next)=>{  // if route not match from above routes then send this response
    next(new ExpressError(404, "Page Not Found"));
})

app.use((err,req,res,next)=>{       // Erron handler Middleware
    const {statusCode = 500, message= "Something went wrong"} = err; // assign default value to statusCode and Message
    res.status(statusCode).render("error.ejs", {err});
})

// starting server
app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});