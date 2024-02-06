import Coupon from "../models/coupon.model.js";
import Product from "../models/products.model.js";
import createError from "../utlis/createError.js";
import wrappedError from "../utlis/errorHandling.js";
import couponJoiSchema from "../validation/Coupon.Joivalidation.js";

const addCoupon = wrappedError(async (req, res, next) => {
  req.body.createdBy = req.crrUser.id;
  let validationCoupon = couponJoiSchema.validate(req.body);
  if (validationCoupon.error) {
    let error = createError.createError(
      400,
      "FAILED",
      validationCoupon.error.details[0].message
    );
    return next(error);
  }
  let existCoupon = await Coupon.findOne({ couponCode: req.body.couponCode });

  if (existCoupon) {
    let error = createError.createError(400, "FAILED", "coupon already exist");
    return next(error);
  }
  let newCoupon = new Coupon(req.body);
  newCoupon.save();
  console.log(newCoupon, "newCouponafter");
  res.status(201).json({
    status: "SUCCESS",
    message: "coupon added successfully",
    data: newCoupon,
  });
});
const updateCoupon = wrappedError(async (req, res, next) => {
  let coupon = await Coupon.findOne({ couponCode: req.params.couponCode });
  if (!coupon) {
    let error = createError.createError(400, "FAILED", "coupon not found");
    return next(error);
  }
  if (coupon.createdBy != req.crrUser.id && req.crrUser.role != "admin") {
    let error = createError.createError(401, "Unauthorized", "Not Allowed");

    return next(error);
  }
  req.body.updatedBy = req.crrUser.id;
  let updatedCoupon = await Coupon.findOneAndUpdate(
    { couponCode: req.params.couponCode },
    req.body,
    { new: true }
  );
  res.status(201).json({
    status: "SUCCESS",
    message: "coupon updated successfully",
    data: updatedCoupon,
  });
});
const deleteCoupon = wrappedError(async (req, res, next) => {
  let coupon = await Coupon.findOne({ couponCode: req.params.couponCode });
  if (!coupon) {
    let error = createError.createError(400, "FAILED", "coupon not found");
    return next(error);
  }
  if (coupon.createdBy != req.crrUser.id && req.crrUser.role != "admin") {
    let error = createError.createError(401, "Unauthorized", "Not Allowed");

    return next(error);
  }
  req.body.deletedBy = req.crrUser.id;
  let deletedCoupon = await Coupon.findOneAndUpdate(
    { couponCode: req.params.couponCode },
    req.body,
    { new: true }
  );
  res.status(201).json({
    status: "SUCCESS",
    message: "coupon deleted successfully",
    data: deletedCoupon,
  });
});

const allCoupons = wrappedError(async (req, res, next) => {
  let coupons = await Coupon.find();
  res.status(201).json({
    status: "SUCCESS",
    message: "coupons fetched successfully",
    data: coupons,
  });
});
const applyCoupon = wrappedError(async (req, res, next) => {
  let { productSlug, couponCode } = req.query;
  let coupon = await Coupon.findOne({ couponCode: couponCode });
  let product = await Product.findOne({ slug: productSlug });
  if (!product) {
    let error = createError.createError(400, "FAILED", "product not found");
    return next(error);
  }
  if (!coupon) {
    let error = createError.createError(400, "FAILED", "coupon not found");
    return next(error);
  }
  if (coupon.deletedBy) {
    let error = createError.createError(
      400,
      "FAILED",
      "coupon deleted try another"
    );
    return next(error);
  }

  if (Date.parse(coupon.expireIn) < Date.now()) {
    let error = createError.createError(400, "FAILED", "coupon expired");
    return next(error);
  }
  if (product.coupon) {
    let error = createError.createError(
      400,
      "FAILED",
      "the product already have coupon"
    );
    return next(error);
  }
  product.coupon = coupon._id;
  product.priceAfterDiscount = product.finalPrice - coupon.value;
  product.save();
  res.status(201).json({
    status: "SUCCESS",
    message: "coupon applied successfully",
    data: product,
  });
});
export { addCoupon, updateCoupon, deleteCoupon, allCoupons, applyCoupon };
