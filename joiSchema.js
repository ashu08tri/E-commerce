const baseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');


const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
      "string.escapeHTML": "{{#label}} must not include HTML!",
    },
    rules: {
      escapeHTML: {
        validate(value, helpers) {
            const clean = sanitizeHtml(value, {
              allowedTags: [],
              allowedAttributes: {},
            });
            if (clean) {
                return clean;
            }
            return helpers.error("string.escapeHTML", { value });
     
          },
      },
    },
  });
  
  const Joi = baseJoi.extend(extension)

module.exports.productSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    deleteImages: Joi.array(),
    stock: Joi.number().required(),
    qty: Joi.number().required()
})


module.exports.reviewSchema = Joi.object({
    review : Joi.string().required(),
    rating : Joi.number().required().min(1).max(5)
}).required()
