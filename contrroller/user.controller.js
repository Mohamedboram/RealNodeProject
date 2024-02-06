import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import wrappedError from "../utlis/errorHandling.js";
import userJoiSchema from "../validation/Joi.user.validation.js";
import createError from "../utlis/createError.js";
import Address from "../models/adress.model.js";
import sendVerificationEmail from "../utlis/nodemailere.js";
import Joi from "joi";
import updateDataUserValidation from "../validation/updateDataUserValidation.js";
import addressJoiSchema from "../validation/addressValidationSchema.js";

const signUp = wrappedError(async (req, res, next) => {
  let validation = userJoiSchema.validate(req.body);
  if (validation.error) {
    let error = createError.createError(
      400,
      "FAILED",
      validation.error.details[0].message
    );
    next(error);
  }
  const existUser = await User.findOne({ email: req.body.email });
  if (existUser) {
    let error = createError.createError(400, "FAILED", "email already exist");
    return next(error);
  }
  if (req.body.password !== req.body.confirmPassword) {
    let error = createError.createError(400, "FAILED", "password not match");
    return next(error);
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  req.body.address.map((address, i) => {
    let addressError = addressJoiSchema.validate(address);

    if (addressError.error) return (req.body.address[i] = undefined);
    const crrAddress = new Address(address);
    crrAddress.save();

    req.body.address[i] = crrAddress._id;
  });

  if (req.body.address.includes(undefined)) {
    return next(createError.createError(401, "Faild", "Address is Invalid"));
  }
  const existUsername = await User.findOne({ userName: req.body.userName });
  if (existUsername) {
    let error = createError.createError(
      400,
      "FAILED",
      "userName is already exist "
    );
    return next(error);
  }
  const user = new User({
    ...req.body,
    password: hashedPassword,
  });

  user.save();
  let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

  sendVerificationEmail(
    user.email,
    `http://localhost:3000/api/user/verify/${token}`
  );
  res
    .status(201)
    .json({ status: "SUCCESS", message: "user created successfully" });
});
const verifySignup = wrappedError(async (req, res, next) => {
  const token = req.params.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await User.findById(decoded.id);
  if (user.isVerified) {
    let error = createError.createError(400, "FAILED", "user already verified");
    next(error);
  }
  user.isVerified = true;
  user.save();
  res
    .status(201)
    .json({ status: "SUCCESS", message: "user verified successfully" });
});

const login = wrappedError(async (req, res, next) => {
  const { email, password } = req.body;
  const existUser = await User.findOne({ email: email });
  if (!existUser) {
    let error = createError.createError(
      400,
      "FAILED",
      "user not found please signup"
    );
    next(error);
  }
  const isMatch = await bcrypt.compare(password, existUser.password);
  if (!isMatch) {
    let error = createError.createError(400, "FAILED", "password not match");
    next(error);
  }

  if (!existUser.isVerified) {
    let error = createError.createError(
      400,
      "FAILED",
      "please verify your email"
    );
    next(error);
  }
  const token = jwt.sign(
    { id: existUser._id, email: existUser.email, role: existUser.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
  res.status(200).json({ status: "Login SUCCESS", token });
});
const updateDataUser = wrappedError(async (req, res, next) => {
  let { email, id } = req.crrUser;
  let user = await User.findById(id);
  if (user.role != "admin")
    return next(
      createError.createError(
        401,
        "Unauthorized",
        "Not allowed to make this changes"
      )
    );
  let userToUpdate = await User.findById(req.params.id);
  if (!userToUpdate)
    return next(createError.createError(400, "Fail", "User ID is Not founded"));
  let { validatError } = updateDataUserValidation.validate(req.body);
  if (validatError)
    return next(
      createError.createError(
        401,
        "Fail",
        "invalid Data cheack schema please..!"
      )
    );
  let userUpdated = await User.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  )
    .populate("address")
    .select(" -_id -password -__v");

  res.json({
    status: "UPDATE_SUCCESS",
    userUpdated,
  });
});

const deactivateUser = wrappedError(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) return res.json("user not found");
  let deactivateUser = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  ).select("email isActive userName");

  res.json({
    status: "deactivate user",
    deactivateUser,
  });
});
export { signUp, verifySignup, login, updateDataUser, deactivateUser };
