const Joi = require("joi");

// Schema for listing validation
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(), // Title is required and must be a string
    description: Joi.string().required(), // Description is required and must be a string
    location: Joi.string().required(), // Location is required and must be a string
    country: Joi.string().required(), // Country is required and must be a string
    price: Joi.number().min(0).required(), // Price is required, must be a number, and must be at least 0
    image: Joi.object({
      url: Joi.string().uri().allow("").optional(), // Image URL is optional, must be a string, and must be a valid URI
      filename: Joi.string().allow("").optional(), // Image filename is optional and must be a string
    }).required(), // Image object is required
  }).required(), // Listing object is required
});

// Schema for review validation
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(), // Rating is required, must be a number, and must be between 1 and 5
    comment: Joi.string().required(), // Comment is required and must be a string
  }).required(), // Review object is required
});
