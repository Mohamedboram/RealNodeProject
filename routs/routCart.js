import express from "express";
import verifyIslogin from "../Serviece/verifyIslogin.js";
import { applyCouponOnCart, createCart, updateCart } from "../contrroller/cart.controller.js";
const routCart = express.Router();



routCart.route("/add_to/:productId").post(
    verifyIslogin,createCart
    
)

routCart.route("/update/:cartId").patch(
    verifyIslogin,updateCart
    
)

routCart.route("/coupon").post(
    verifyIslogin,applyCouponOnCart
    
)


export default routCart