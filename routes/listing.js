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
};

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
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/Listings");
    }
    res.render("listings/show.ejs", {listing});
}));

//Create route
router.post("/",
 validateListing,
 wrapAsync(async (req, res, next) =>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Lisiting Created!");
    res.redirect("/Listings");
}));


//Edit route
router.get("/:id/edit", wrapAsync(async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/Listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

//Update route
router.put("/:id",
 validateListing,
 wrapAsync(async (req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Lisiting Updated!");
    res.redirect(`/Listings/${id}`);
}));

//DElete route 
router.delete("/:id", wrapAsync(async (req, res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Lisiting Deleted!");
    res.redirect("/Listings");
}));

module.exports = router;