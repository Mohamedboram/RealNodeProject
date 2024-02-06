import mongoose from "mongoose";
import Category from "../models/category.model.js";
import createError from "../utlis/createError.js";
import wrappedError from "../utlis/errorHandling.js";
import categoryJoiSchema from "./../validation/category.JoiValidation.js";

const addCategory = wrappedError(async (req, res, next) => {
  req.body.createdBy = req.crrUser.id;
  if (req.file) req.body.image = req.file.filename;

  let categoryerror = categoryJoiSchema.validate(req.body);
  if (categoryerror.error) {
    let error = createError.createError(
      400,
      "FAILED",
      categoryerror.error.details[0].message
    );
    return next(error);
  }
  const existCategory = await Category.findOne({
    categoryName: req.body.categoryName,
  });
  if (existCategory) {
    let error = createError.createError(
      400,
      "FAILED",
      "category already exist"
    );
    return next(error);
  }

  const crrCategory = new Category(req.body);
  crrCategory.save();
  res.status(201).json({
    status: "SUCCESS",
    message: "category added successfully",
    data: crrCategory,
  });
});
const getAllCategory = wrappedError(async (req, res, next) => {
  let allCategory = await Category.find();
  if (allCategory.length === 0)
    return next(createError.createError(404, "Faild", "Page Not Found"));
  res.json({
    status: "Success",
    message: "Categories fetched successfully",
    allCategory,
  });
});
const specificCategory = wrappedError(async (req, res, next) => {
  console.log(req.params);
  let foundedCategory = await Category.find({
    categoryName: req.params.categoryName,
  });
  if (foundedCategory.length === 0)
    return next(createError.createError(404, "Faild", "this category not found"));
  res.json({
    status: "Success",
    message: "Categories fetched successfully",
    foundedCategory,
  });
});
const updateCategory = wrappedError(async (req, res, next) => {
  if (req.file) req.body.image = req.file.filename;
  let { categoryName } = req.params;
  let existCategory = await Category.findOne({
    categoryName,
  })
    .select({
      _id: 0,
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    })
    .lean();
  if (!existCategory)
    return next(
      createError.createError(404, "Category not found", "Not Found")
    );
  if (existCategory.createdBy != req.crrUser.id && req.crrUser.role != "admin")
    return next(createError.createError(401, "Unauthorized", "Not Allowed"));

  existCategory.createdBy = existCategory.createdBy.valueOf();
  let dataUpdate = {
    ...existCategory,
    ...req.body,
  };

  let categoryerror = categoryJoiSchema.validate(dataUpdate);
  if (categoryerror.error) {
    let error = createError.createError(
      400,
      "FAILED",
      categoryerror.error.details[0].message
    );
    return next(error);
  }
  let finalUpdate = await Category.findOneAndUpdate(
    { categoryName },
    {
      ...dataUpdate,
    },
    { new: true }
  );
  res.json({
    status: "Success",
    message: "Category updated successfully",
    data: finalUpdate,
  });
});
const deleteCategory = wrappedError(async (req, res, next) => {
  let { categoryName } = req.params;
  let existCategory = await Category.findOne({
    categoryName,
  })
   
  if (!existCategory)
    return next(
      createError.createError(404, "Category not found", "Not Found")
    );
  if (existCategory.createdBy != req.crrUser.id && req.crrUser.role != "admin")
    return next(createError.createError(401, "Unauthorized", "Not Allowed"));

  let deletedCategory = await Category.findOneAndDelete({ categoryName });
  res.json({
    status: "Success",
    message: "Category deleted successfully",
    deletedCategory,
  });
    
})
export { addCategory, getAllCategory, specificCategory, updateCategory, deleteCategory };
