import express from "express";
const routPayment = express.Router();
import verifyIslogin from "../Serviece/verifyIslogin.js";
import {
  cancelPayment,
  createPayment,
  successPayment,
} from "../contrroller/payment.controller.js";

routPayment.route("/buy/:cartId").get(verifyIslogin, createPayment);
routPayment.route("/success").get(successPayment);
routPayment.route("/cancel").get(cancelPayment);

export default routPayment;
