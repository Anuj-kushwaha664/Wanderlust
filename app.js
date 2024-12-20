const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const { redirect, cookie } = require("express/lib/response");
const ejsMate = require("ejs-mate");
const ExpressError = require("./util/ExpressError.js");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require('connect-flash');
const Listing = require("./models/listing");
require('dotenv').config();
const GoogleStrategy = require("./config/googleStrategy.js")


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const paymentRouter = require("./routes/payment.js");
const authRouter = require("./routes/auth.js");

const atlas_url=process.env.ATLASDB_URL;

// connection with database
main().then(()=>{
    console.log("connected to Db");
}).catch((err)=>{
    console.log(err);
})


async function main(){
    // await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    await mongoose.connect(atlas_url);
}

const store = MongoStore.create({
    mongoUrl: atlas_url,
    crypto:{
        secret: "akalsdkaiefaslksdkfsl"
    },
    touchAfter:24*3600,
})
store.on("error", (err)=>{
    console.log("Error in MONGO_SESSION_STORE", err)
})

const sessionObject = {
    store,
    secret : "mysupersecretstring",
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires : Date.now() + 7*24*60*60*1000, // date.now give time in second of now
        maxAge: 7*24*60*60*1000,
        httpOnly : true
    }
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}))  // to enable url parsing
app.use(methodOverride("_method"));
app.engine("ejs",  ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(expressSession(sessionObject));
app.use(flash());



// passport set-up
app.use(passport.initialize());
app.use(passport.session());        
passport.use(new localStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/payments",  paymentRouter);

app.get("/",  async(req,res)=>{
    const allListings = await Listing.find({});
    console.log(req.user);
    res.render("./Listings/index.ejs", {allListings});
})


app.use(express.json());

app.use("/auth", authRouter);
app.use("/listings",  listingRouter);
app.use("/listings/:id",  reviewRouter);
app.use("/users",  userRouter);
  
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