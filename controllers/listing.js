const Listing = require("../models/listing");


module.exports.indexController = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("./Listings/index.ejs", {allListings});
}

module.exports.newController = (req,res)=>{
    res.render("./Listings/new.ejs");
}

module.exports.createController = async(req,res,next)=>{  // handling error using wrapAsync function because try catch is bulky
    let url = req.file.path;
    let filename = req.file.filename;

    const newlisting = new Listing({...req.body, owner : req.user._id});
    newlisting.image = {url,filename};
    await newlisting.save();

    req.flash("success", "New listing created!");
    res.redirect("/listings")
}

module.exports.showContoller = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({ path : "reviews",
        populate : {
            path : "author"
        }
    })
    .populate("owner");
    // console.log(listing);
    res.render("./Listings/show.ejs", {listing});
}

module.exports.editFormController = async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_150,w_200");
    res.render("./Listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.editController = async(req,res)=>{
    if(Object.keys(req.body).length==0){
        throw new ExpressError(404, "Send Valid data for listing")
    }
    const {id} = req.params;
   
    await Listing.findByIdAndUpdate(id, req.body);
    req.flash("success", "Listing updated successfully");
    console.log("nice");
   res.redirect(`/listings/${id}`);
}

module.exports.deleteController = async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}