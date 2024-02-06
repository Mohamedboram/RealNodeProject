import express from "express";
import verifyIslogin from "../Serviece/verifyIslogin.js";
import {
  addCategory,
  deleteCategory,
  getAllCategory,
  specificCategory,
  updateCategory,
} from "../contrroller/category.controller.js";
import upload from "../middelware/upload.middleware.js";

const routCategory = express.Router();

routCategory.route("/").get(getAllCategory);
routCategory.route("/:categoryName").get(specificCategory);
routCategory
  .route("/:categoryName")
  .patch(verifyIslogin, upload.single("image"), updateCategory)
  .delete(verifyIslogin, deleteCategory);

routCategory
  .route("/add")
  .post(verifyIslogin, upload.single("image"), addCategory);

export default routCategory;
