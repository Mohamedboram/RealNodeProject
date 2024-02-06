import Joi from "joi";

const updateDataUserValidation = Joi.object({
  email: Joi.string().email(),

  userName: Joi.string().min(3).lowercase(),

  role: Joi.string().default("user"),
  isVerified: Joi.boolean().default(false),
  address: Joi.array(),
});
export default updateDataUserValidation;
