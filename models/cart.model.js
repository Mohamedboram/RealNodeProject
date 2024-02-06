import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  priceAfterDiscount: {
    type: Number,
    required: true,
  },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],
  coupon: {
    type: String,
    ref: "Coupon",
    default: null,
  },
  accepted: {
    type: Boolean,
    default: false,
  },
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
