const User = require("../models/user.js");

module.exports.loginController = async(req,res)=>{
    req.flash("success" , "welcome to WonderLust you are logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logoutController  = (req,res)=>{
    req.logout((err)=>{   // passsport ka method hai
        if(err){
            return next(err);
        }
        req.flash("success", "logged out successfully");
        res.redirect("/listings");
    })

}

module.exports.signupController = async(req,res)=>{
    try{
        let {username, email,password} = req.body;
        let newUser = await new User({email,username});
        const registeredUser = await User.register(newUser, password);
    
        console.log(registeredUser);
        req.login(registeredUser,  (err)=>{ // passport ka method hai
                if(err){
                    return next(err);
                }
                req.flash('success', "User registed Successfully");
                res.redirect("/listings");
        })
    
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/users/signup");
    }
    
}