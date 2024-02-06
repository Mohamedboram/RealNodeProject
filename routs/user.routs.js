import express from "express";
import {
  deactivateUser,
  login,
  signUp,
  updateDataUser,
  verifySignup,
} from "../contrroller/user.controller.js";
import checkValidationLogin from "./../validation/checkValidationLogin.js";
import verifyIslogin, { checkUser } from "../Serviece/verifyIslogin.js";
import resetPassword from "../Serviece/resetpassword.js";
import forgetPassword from "../Serviece/forgetPassword.js";

const routUsers = express.Router();

routUsers.route("/signin").post(checkValidationLogin, login);

routUsers.route("/signup").post(signUp);
routUsers.route("/verify/:token").get(verifySignup);

routUsers
  .route("/resetpassword/:id")
  .post(verifyIslogin, checkUser, resetPassword);
routUsers.route("/forgetpassword").post(forgetPassword);
routUsers.route("/update/:id").post(verifyIslogin, updateDataUser);
routUsers
  .route("/deactivate/:id")
  .post(verifyIslogin, checkUser, deactivateUser);
export default routUsers;
