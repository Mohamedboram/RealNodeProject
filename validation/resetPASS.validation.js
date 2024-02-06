import Joi from "joi";

const resetPasswordSchema = Joi.object({
  currentPassword: Joi.string().required().min(6),
  newPassword: Joi.string().required().min(6),
  confirmPassword: Joi.any()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({ "any.only": " confirm password not match" }),
});
export const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().required().min(6),
  confirmPassword: Joi.any()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({ "any.only": " confirm password not match" }),
});

export default resetPasswordSchema;
