import Product from "../models/products.model.js";

import createError from "../utlis/createError.js";
import wrappedError from "../utlis/errorHandling.js";
import joiProductSchema from "../validation/joiValidation.product.js";
import slugify from "slugify";

import deleteFile from "../middelware/deletefile.js";

const addProduct = wrappedError(async (req, res, next) => {
  if (!req.file) {
    let error = createError.createError(400, "FAILED", "image is required");
    return next(error);
  }
  req.body.image = req.file.filename;

  let validateProduct = joiProductSchema.validate(req.body);
  if (validateProduct.error) {
    let error = createError.createError(
      400,
      "FAILED",
      validateProduct.error.details[0].message
    );

    deleteFile(`uploads/${req.file.filename}`);
    return next(error);
  }

  req.body.slug = slugify(req.body.productName, { lower: true });
  const findProudct = await Product.findOne({
    slug: req.body.slug,
  });
  if (findProudct) {
    let error = createError.createError(
      400,
      "FAILED",
      "Product already exist try change the slug"
    );
    deleteFile(`uploads/${req.file.filename}`);
    return next(error);
  }

  const product = new Product({ ...req.body, createdBy: req.crrUser.id });
  product.save();

  res.json({
    status: "Success",
    message: "product added successfully",
    product,
  });
});

const updateProduct = wrappedError(async (req, res, next) => {
  if (req.file) req.body.image = req.file.filename;
  let product = await Product.findById(req.params.id)
    .select({
      _id: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    })
    .lean();
  if (!product)
    return next(createError.createError(404, "Product not found", "Not Found"));

  if (product.createdBy != req.crrUser.id && req.crrUser.role != "admin")
    return next(createError.createError(401, "Unauthorized", "Not Allowed"));

  let dataToUpdate = { ...product, ...req.body };
  console.log(dataToUpdate);
  if (req.body.ProductName) {
    dataToUpdate.slug = slugify(req.body.ProductName, { lower: true });
  }
  let validateProduct = joiProductSchema.validate(dataToUpdate);
  if (validateProduct.error) {
    let error = createError.createError(
      400,
      "FAILED",
      validateProduct.error.details[0].message
    );
    return next(error);
  }

  let upadatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { ...dataToUpdate },
    { new: true }
  ).select({ _id: 0, __v: 0 });
  res.json({
    status: "Success",
    message: "product updated successfully",
    upadatedProduct,
  });
});

const deleteProduct = wrappedError(async (req, res, next) => {
  let product = await Product.findById(req.params.id)
    .select({
      _id: 0,
      __v: 0,
    })
    .lean();
  if (!product)
    return next(createError.createError(404, "Product not found", "Not Found"));

  if (product.createdBy != req.crrUser.id && req.crrUser.role != "admin")
    return next(createError.createError(401, "Unauthorized", "Not Allowed"));

  let deletedProduct = await Product.findByIdAndDelete(req.params.id);
  res.json({
    status: "Success",
    message: "product deleted successfully",
    deletedProduct,
  });
});

const allProducts = wrappedError(async (req, res, next) => {
  let { page } = req.query;
  let limit = 6;
  let skip = (page - 1) * limit;
  let products = await Product.find().limit(limit).skip(skip).select({
    __v: 0,
  });
  if (products.length === 0)
    return next(
      createError.createError(404, "Products not found", "Page Not Found")
    );
  res.json({
    status: "Success",
    message: "products fetched successfully",
    products,
  });
});
const categoryProduct = wrappedError(async (req, res, next) => {
  let { category } = req.params;
  let products = await Product.find({ category }).select({
    __v: 0,
  });
  if (products.length === 0)
    return next(
      createError.createError(404, "Products not found", "Category Not Found")
    );
  res.json({
    status: "Success",
    message: "products fetched successfully",
    products,
  });
});
const specificProduct = wrappedError(async (req, res, next) => {
  let product = await Product.findById(req.params.id)
    .select({
      __v: 0,
    })
    .lean();
  if (!product)
    return next(createError.createError(404, "Product not found", "Not Found"));
  res.json({
    status: "Success",
    message: "product fetched successfully",
    product,
  });
});
export {
  specificProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  allProducts,
  categoryProduct,
};
