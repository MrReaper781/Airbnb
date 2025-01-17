const joi = require("joi");

exports.listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required().messages({
        "string.empty": "Title is required",
        "any.required": "Title is required",
      }),
      description: joi.string().required().messages({
        "string.empty": "Description is required",
        "any.required": "Description is required",
      }),
      location: joi.string().required().messages({
        "string.empty": "Location is required",
        "any.required": "Location is required",
      }),
      country: joi.string().required().messages({
        "string.empty": "Country is required",
        "any.required": "Country is required",
      }),
      price: joi.number().required().messages({
        "number.base": "Price must be a number",
        "any.required": "Price is required",
      }),
      image: joi.string().allow("", null).messages({
        "string.base": "Image must be a valid URL or empty",
      }),
    })
    .required()
    .messages({
      "any.required": "Listing object is required",
    }),
});

exports.reviewSchema = joi.object({
  review: joi
    .object({
      comment: joi.string().required(),
      rating: joi.number().required(),
    })
    .required(),
});
