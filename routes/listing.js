const express = require("express")
const router = express.Router();
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError")
const { listingSchema } = require("../schema.js")
const ejsMate = require("ejs-mate")


const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        next(new ExpressError(400, errMsg));
    } else {
        next();
    }
};


//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}));

//New Route
router.get("/new", wrapAsync(async (req, res) => {
    res.render("listings/new.ejs")
}))

//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id).populate("reviews")
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing })
}))

//Create Route
router.post("/", validateListing, wrapAsync(async(req, res, next) => {
    const newListing = new Listing(req.body.listing)
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    if(!listing) {
        req.flash("error", "Listing you requested to edit does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing })
}))

//Update Route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, {...req.body.listing})
    req.flash("success", "Listing Updated!");
    res.redirect("/listings")
}))

//Delete Route
router.delete("/:id", wrapAsync( async (req, res) => {
    let { id } = req.params
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings")
}))

module.exports = router;