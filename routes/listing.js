const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utilities/wrapAsync");
const {isLoggedIn, isOwner,validateListing} = require("../middleware");
const multer  = require('multer')
const {storage} = require("../cloudConfig")
const upload = multer({ storage});

const listingController = require("../controllers/listing");

router
.route("/")
.get( wrapAsync(listingController.index))
.post(upload.single('listing[image]'),validateListing,wrapAsync(listingController.createRoute));


//New Route .............
 
router.get("/new",isLoggedIn,listingController.newFormRoute);
 
 
router
.route("/:id")
.get(wrapAsync(listingController.showRoute))
.put(isLoggedIn,isOwner, upload.single('listing[image]'),validateListing ,wrapAsync(listingController.updateRoute))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteRoute));

 
 //Edit Route ......
 router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editRoute));


 module.exports = router;
 