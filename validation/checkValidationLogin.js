import createError from "../utlis/createError.js";
import loginJoiSchema from "./loginJoiSchema.js";

const checkValidationLogin = (req, res, next) => {
  let validation = loginJoiSchema.validate(req.body);
  if (validation.error) {
   
    let error = createError.createError(
      400,
      "FAILED",
      validation.error.details[0].message
    );
    next(error);
  }
  next();
};

export default checkValidationLogin;
