import express from "express";
import verifyIslogin from "../Serviece/verifyIslogin.js";
import { addCoupon, allCoupons, applyCoupon, deleteCoupon, updateCoupon } from "../contrroller/coupon.controller.js";


const routCoupon = express.Router();


routCoupon.route("/add").post(

    verifyIslogin,addCoupon
);
routCoupon.route("/update/:couponCode").patch(

    verifyIslogin,updateCoupon
);
routCoupon.route("/delete/:couponCode").delete(

    verifyIslogin,deleteCoupon
);
routCoupon.route("/all").get(

    allCoupons
);
routCoupon.route("/apply").post(

       verifyIslogin,applyCoupon   

)











export default routCoupon