const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN ;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
 }
 
 module.exports.newFormRoute = (req,res) =>{
    res.render("listings/new.ejs");
    }

module.exports.showRoute = async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate :{
      path : "author"
    },}).populate("owner");
    if(!listing){
      req.flash("error","Listing Does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
   }    

module.exports.createRoute = async (req,res,next) =>{

   let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    })
      .send();

   let url = req.file.path;
   let filename = req.file.filename;
     const newListing = new Listing(req.body.listing);
     newListing.owner = req.user._id;
     newListing.image = {url,filename};
     newListing.geometry = response.body.features[0].geometry ;
     await newListing.save();
     req.flash("success","New Listing created!");
     res.redirect("/listings");
 }

 module.exports.editRoute = async (req,res) =>{
    let {id} = req.params;
 const listing = await Listing.findById(id);
 if(!listing){
   req.flash("error","Listing Does not exist!");
   res.redirect("/listings");
 }
 let originalImageUrl = listing.image.url;
 originalImageUrl = originalImageUrl.replace("/upload","/upload/h_200,w_250");
 res.render("listings/edit.ejs",{listing, originalImageUrl });
}

module.exports.updateRoute =  async (req,res) =>{
     let {id} = req.params;
     if (req.body.listing.location) {
      const geoData = await geocodingClient.forwardGeocode({
          query: req.body.listing.location,
          limit: 1
      }).send();

      req.body.listing.geometry = {
          type: "Point",
          coordinates: geoData.body.features[0].geometry.coordinates
      };
  }
  await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url,filename};
      await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect("/listings");   
 }

 module.exports.deleteRoute = async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");  
}
 