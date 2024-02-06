import Joi from "joi";

const userJoiSchema = Joi.object({
  userName: Joi.string().required().min(3).lowercase(),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  role: Joi.string().default("user"),
  isVerified: Joi.boolean().default(false),
  address: Joi.array(),
});
export default userJoiSchema;
