let GoogleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto');
require('dotenv').config();
const User = require("../models/user.js");
const passport = require("passport");


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://wanderlust-bb60.onrender.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done){
    // find a user
    // console.log(profile);
    
    User.findOne({username : profile.displayName}).then((user)=>{

        if(user){
            // if found , set this user as req.user
            return done(null, user, { message: 'logged in successfully' });
        }else{
            // if not found , create the user and set it as req.user
            const newuser = new User({
                username : profile.displayName,
                email : profile.emails[0].value,
            })

            User.register(newuser, crypto.randomBytes(20).toString('hex'))
            .then((data)=>{
                return done(null,data, { message: 'Signed up successfully' });
            }).catch((err)=>{
                console.log("error in creatinng google strategy passport",err);
                return;
            })
        }
    }).catch((err)=>{
        if(err){console.log('error in google strategy-passport',err); return ;}
    })
}
));