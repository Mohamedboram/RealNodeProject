import Joi from "joi";

const joiProductSchema = Joi.object({
  productName: Joi.string().required(),

  slug: Joi.string().default(""),
  finalPrice: Joi.number().required(),
  image: Joi.string().required(),
  category: Joi.string().required(),
  stock: Joi.number().required(),
  coupon: Joi.any().default(null),
  createdBy: Joi.any(),
});

export default joiProductSchema;
