const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { loginController, logoutController, signupController } = require("../controllers/user.js");

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs" );
})

router.post("/signup", signupController)

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", {failureRedirect:"/users/login", failureFlash:true}), 
    loginController)

router.get("/logout", logoutController)

module.exports = router;