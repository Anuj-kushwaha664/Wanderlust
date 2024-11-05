const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const { indexController, newController, createController, showContoller, editController, deleteController,editFormController } = require("../controllers/listing.js");
const multer  = require('multer')
const{storage}=require("../cloudConfig.js");
const upload = multer({storage });


router.get("/",wrapAsync(indexController));

router.get("/new",isLoggedIn, newController)

// create route
router.post("/",
    isLoggedIn, 
    upload.single("image"),
    validateListing, 
    wrapAsync(createController)) ;
// router.post("/",isLoggedIn, upload.single("image") ,wrapAsync(async(req,res)=>{
//     res.send(req.file);
// })) 

// show route
router.get("/:id", wrapAsync(showContoller));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(editFormController));

router.put("/:id", isLoggedIn,isOwner, upload.single("image"), wrapAsync(editController));

// Delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(deleteController));

module.exports = router;