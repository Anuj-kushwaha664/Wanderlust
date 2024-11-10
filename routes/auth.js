const express = require("express");
const router = express.Router();
const passport = require("passport");
const flash = require('connect-flash');

router.get("/google", 
    passport.authenticate("google", {scope  : ["profile", "email"]}));

router.get("/google/callback", passport.authenticate("google", {
    failureRedirect:"/users/signup"
}), (req,res)=>{
    const successMessage = req.authInfo ? req.authInfo.message : 'Logged in successfully';
    req.flash("success", successMessage);
    return res.redirect("/listings");
})



module.exports = router;