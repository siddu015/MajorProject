const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path");
const Listing = require("./models/listing.js")
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate")

const port = 8080
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

app.use((req, res, next) => {
    req.responseTime = new Date(Date.now()).toString(); // Attach response time to req object
    console.log(req.method, req.path, req.responseTime, req.hostname); // Log request details
    next(); // Passes control to the next middleware
});

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

main()
    .then(() => {
        console.log("Connected to DB.")
    })
    .catch((err) => {
        console.log(err)
    })

async function main(){
    await mongoose.connect(MONGO_URL);
}

//Home Route
app.get("/", (req, res) => {
    res.send("I'm groot")
})

//Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
})

//New Route
app.get("/listings/new", async (req, res) => {
    res.render("listings/new.ejs")
})

//Show Route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", { listing })
})

//Create Route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing)
    await newListing.save();
    res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
})

//Update Route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, {...req.body.listing})
    res.redirect("/listings")
})

//Delete Route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    res.redirect("/listings")
})

//Patch Route
app.listen(port, () => {
    console.log(port," is running")
})


