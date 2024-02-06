import User from "../models/user.model.js";
import bcrypt from "bcrypt";

import wrappedError from "../utlis/errorHandling.js";

import createError from "../utlis/createError.js";

import resetPasswordSchema from "../validation/resetPASS.validation.js";

const resetPassword = wrappedError(async (req, res, next) => {
  const user = await User.findById(req.crrUser.id);
  let { currentPassword, newPassword } = req.body;

  let checkPassword = await bcrypt.compare(currentPassword, user.password);

  if (!checkPassword) {
    let error = createError.createError(401, "Failed", "Password not correct");
    next(error);
  }
  let { error } = resetPasswordSchema.validate(req.body);

  if (error) {
    let errorBody = createError.createError(401, "Failed", error.message);
    next(errorBody);
  }
  let updateUser = await User.findByIdAndUpdate(
    user._id,
    { password: await bcrypt.hash(newPassword, 10) },
    { new: true }
  );

  res.json({ status: "SUCCESS", data: updateUser });
});
export default resetPassword;
