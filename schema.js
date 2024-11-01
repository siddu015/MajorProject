const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        category: Joi.string().valid(
            'Trending',
            'Rooms',
            'Iconic Cities',
            'Mountains',
            'Castles',
            'Amazing Pools',
            'Free Wi-Fi',
            'Restaurants',
            'Romantic Getaways',
            'Pet-Friendly'
        ).required() // Ensure the category is required
    }).required() // Ensure the listing object is required
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});