import createError from "../utlis/createError.js";
import wrappedError from "../utlis/errorHandling.js";
import { forgetPasswordSchema } from "../validation/resetPASS.validation.js";
import User from "./../models/user.model.js";
import bcrypt from "bcrypt";

const forgetPassword = wrappedError(async (req, res, next) => {
  let { email } = req.body;
  let user = await User.findOne({ email: email });
  if (!user)
    next(createError.createError(403, "FAILD", "This Email not Exist"));
  let { error } = forgetPasswordSchema.validate(req.body);
  if (error)
    next(createError.createError(403, "FAILD", error.details[0].message));

  let updateUser = await User.findOneAndUpdate(
    { email: email },
    { password: await bcrypt.hash(req.body.newPassword, 10) },
    { new: true }
  );
  res.json({ status: "Success", updateUser });
});

export default forgetPassword;
