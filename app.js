const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() =>{
    console.log('Server is running');
    })
    .catch(()=>{
        console.error('Could not start server');
    })


async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.send("Hin I am groot");
});

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calagori, Goa",
//         country: "India,"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.get("/Listings", async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

//New Route
app.get("/listings/new", (req, res) =>{
    res.render("listings/new.ejs");
});

//show route
app.get('/Listings/:id', async (req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

//Create route
app.post("/listings", async (req, res) =>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/Listings");
});

//Edit route
app.get("/listings/:id/edit", async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

//Update route
app.put("/listings/:id", async (req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/Listings/${id}`);
});

//DElete route 
app.delete("/listings/:id", async (req, res) =>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/Listings");
});

app.listen(port, () =>{
    console.log(`Server is running on http://localhost:${port}/Listings`);
});