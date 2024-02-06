import Joi from "joi";

const addressJoiSchema = Joi.object({
  country: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.number().required(),
});
export default addressJoiSchema;
