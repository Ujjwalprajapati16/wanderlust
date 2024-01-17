const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errorMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errorMsg);
    } else {
        next();
    }
}

//Index route
router.get("/", wrapAsync(async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//New Route
router.get("/new", (req, res) =>{
    res.render("listings/new.ejs");
});

//show route
router.get('/:id', wrapAsync(async (req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));

//Create route
router.post("/",
 validateListing,
 wrapAsync(async (req, res, next) =>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/Listings");
}));


//Edit route
router.get("/:id/edit", wrapAsync(async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//Update route
router.put("/:id",
 validateListing,
 wrapAsync(async (req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/Listings/${id}`);
}));

//DElete route 
router.delete("/:id", wrapAsync(async (req, res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/Listings");
}));

module.exports= router;