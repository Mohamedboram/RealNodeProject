import wrappedError from "../utlis/errorHandling.js";
import createError from "../utlis/createError.js";
import Cart from "../models/cart.model.js";
import Product from "../models/products.model.js";
import Coupon from "../models/coupon.model.js";
// import { session } from 'express-session';

const createCart = wrappedError(async (req, res, next) => {
  let productId = req.params.productId;
  let product = await Product.findById(productId);
  if (!product) {
    let error = createCart.createError(400, "FAILD", "Not have this ProductId");
    return next(error);
  }
  let userId = req.crrUser.id;
  let findCart = await Cart.findOne({ userId, accepted: false });
  // console.log(findCart);

  if (findCart) {
    const existingProduct = findCart.products.find(
      (p) => p._id.valueOf() == productId
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      findCart.products.push({ _id: product._id, quantity: 1 });
    }

    findCart.totalPrice += product.finalPrice;
    findCart.priceAfterDiscount += product.priceAfterDiscount;

    findCart.save();
    return res
      .status(201)
      .json({ message: "success updated cart ", data: findCart });
  }
  // console.log(productId);
  let newCart = new Cart({
    userId,
    totalPrice: product.finalPrice,
    priceAfterDiscount: product.priceAfterDiscount,
    products: [{ _id: productId, quantity: 1 }],
  });
  newCart.save();
  res.status(201).json({ status: "Success", data: newCart });
});

const updateCart = wrappedError(async (req, res, next) => {
  const cartId = req.params.cartId;
  const existingCart = await Cart.findById(cartId);
  if (!existingCart) {
    return next(
      createError.createError(400, "failed", "the cart does not exist")
    );
  }

  if (req.crrUser.id != existingCart.userId && req.crrUser.role !== "admin") {
    const error = createError.createError(
      401,
      "unauthorized",
      "Not allowed to update this cart"
    );
    return next(error);
  }

  if (req.body.products) {
    existingCart.products = req.body.products;
    existingCart.totalPrice = 0;
    existingCart.priceAfterDiscount = 0;
    console.log(existingCart.products);
    console.log(req.body.products);
    for (const product of existingCart.products) {
      const foundProduct = await Product.findById(product);
      console.log(foundProduct);
      if (!foundProduct) {
        return next(
          createError.createError(400, "failed", "the product does not exist")
        );
      }

      existingCart.totalPrice += foundProduct.finalPrice;
      existingCart.priceAfterDiscount += foundProduct.priceAfterDiscount;
    }

    await existingCart.save();
    return res.status(200).json({ status: "success", data: existingCart });
  }
});
const applyCouponOnCart = wrappedError(async (req, res, next) => {
  let { couponCode, cartId } = req.query;
  let coupon = await Coupon.findOne({ couponCode });

  let cart = await Cart.findById(cartId);
  if (!coupon) {
    let error = createError.createError(400, "FAILED", "coupon not found");
    return next(error);
  }
  if (!cart) {
    let error = createError.createError(400, "FAILED", "cart not found");
    return next(error);
  }
  if (Date.parse(coupon.expireIn) < Date.now()) {
    let error = createError.createError(400, "FAILED", "coupon expired");
    return next(error);
  }
  if (cart.coupon) {
    let error = createError.createError(400, "FAILED", "coupon already exist");
    return next(error);
  }
  if (cart.priceAfterDiscount < cart.totalPrice) {
    let error = createError.createError(
      400,
      "FAILED",
      "coupon not valid for this cart because coupon applied before"
    );
    return next(error);
  }
  console.log(cart.userId, req.crrUser.id);
  if (cart.userId != req.crrUser.id && req.crrUser.role !== "admin") {
    let error = createError.createError(
      401,
      "FAILED",
      "not allowed to apply coupon on cart of another user"
    );
    return next(error);
  }

  cart.coupon = coupon._id;
  cart.priceAfterDiscount = cart.priceAfterDiscount - coupon.value;
  cart.save();
  res.status(201).json({
    status: "SUCCESS",
    message: "coupon applied successfully",
    data: cart,
  });
});
export { createCart, updateCart, applyCouponOnCart };
