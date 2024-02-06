import "dotenv/config";
import express from "express";

import connect from "./utlis/data.connect.js";
import Address from "./models/adress.model.js";
import User from "./models/user.model.js";
import routUsers from "./routs/user.routs.js";
import routProducts from "./routs/product.rout.js";
import cors from "cors";
import routCategory from "./routs/category.routs.js";
import routCoupon from "./routs/coupon.route.js";
import routCart from "./routs/routCart.js";
// import session from "express-session";
import routPayment from "./routs/routpayment.js";
const app = express();
connect();
// app.use(session({
//   secret: "keyboard cat",
//   resave: false,
//   saveUninitialized: true,
// }))

app.use(cors());

app.use("/uploads", express.static("uploads"));
app.use("/uploads/categories", express.static("uploads/categories"));
app.use(express.json());

app.use("/api/user", routUsers);
app.use("/api/product", routProducts);
app.use("/api/category", routCategory);
app.use("/api/coupon", routCoupon);
app.use("/api/cart", routCart);
app.use("/payment", routPayment);
app.use("/", (req, res, next) => {
  res.json({
    status: "success",
    message: "server is running",
    version: "1.0.0",
    author: "ahmed",
  });
});
app.use("*", (req, res) => {
  res.status(404).json({
    status: "FAild",
    message: "rout is not found",
  });
});
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.statusText || "Failed",
    error: err.message || "Something went wrong",
  });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
