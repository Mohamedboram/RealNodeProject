import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  priceAfterDiscount: {
    type: Number,
    
    
  },
  finalPrice: {
    type: Number,

    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
    default: null
  }

}, {
  timestamps: true
});
productSchema.pre('save', function (next) {
  if (!this.priceAfterDiscount) {
    this.priceAfterDiscount = this.finalPrice;
  }
  next();
});
const Product = mongoose.model("Product", productSchema);

export default Product;
