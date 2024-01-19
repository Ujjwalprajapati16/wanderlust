const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

//Index route
router.get("/", wrapAsync(async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//New Route
router.get("/new", isLoggedIn , (req, res) =>{

    res.render("listings/new.ejs");
});

//show route
router.get('/:id', wrapAsync(async (req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path:"reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/Listings");
    }
    res.render("listings/show.ejs", {listing});
}));

//Create route
router.post("/",
 isLoggedIn,
 validateListing,
 wrapAsync(async (req, res, next) =>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Lisiting Created!");
    res.redirect("/Listings");
}));

//Edit route
router.get("/:id/edit", isLoggedIn , isOwner, wrapAsync(async (req, res) =>{
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
 isLoggedIn, isOwner,
 validateListing,
 wrapAsync(async (req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Lisiting Updated!");
    res.redirect(`/Listings/${id}`);
}));

//DElete route 
router.delete("/:id", isLoggedIn , isOwner, wrapAsync(async (req, res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Lisiting Deleted!");
    res.redirect("/Listings");
}));

module.exports = router;