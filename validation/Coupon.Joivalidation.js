import Joi from "joi";

const couponJoiSchema = Joi.object({
  couponCode: Joi.string().required(),
  value: Joi.number().required(),
  createdBy: Joi.string().default(null),
  updatedBy: Joi.string().default(null),

  deletedBy: Joi.string().default(null),
  expireIn: Joi.date().required(),
});

export default couponJoiSchema;
