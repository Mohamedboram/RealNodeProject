import Joi from "joi";

const categoryJoiSchema = Joi.object({
  categoryName: Joi.string().required(),
  createdBy: Joi.string().hex().min(24).max(24).required(),
  image: Joi.string().required(),
});
export default categoryJoiSchema