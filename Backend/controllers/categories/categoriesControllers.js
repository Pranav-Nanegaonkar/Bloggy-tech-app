const mongoose = require("mongoose");
const Category = require("../../models/Categories/Categories");
const asyncHandler = require("express-async-handler");

//@descripition: Create new category
//@route POST /api/v1/category/
//@access private
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const isCategoryPresent = await Category.findOne({ name });
  if (isCategoryPresent) {
    throw new Error("Category already Existing");
  }
  const category = await Category.create({
    name: name,
    author: req?.userAuth?._id,
  });
  return res.status(201).json({
    status: "success",
    message: "Category created successfully",
    category,
  });
});

//@descripition: Get all Categories
//@route GET /api/v1/category/
//@access public
exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).populate({
    path:"posts",
    model:"Post"
  });

  return res.status(200).json({
    status: "success",
    message: "All categories successfuly fetched",
    allCategories,
  });
});

//@descripition: Delete Single Category
//@route DELETE /api/v1/category/:id
//@access private
exports.deleteCategories = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error = new Error("Invalid category ID!");
    next(error);
    return;
  }
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    let error = new Error("Category not exist!");
    next(error);
    return;
  }
  res.json({ status: "success", message: "Category deleted!" });
});

//@descripition: Update Single Category
//@route PUT /api/v1/category/:id
//@access private
exports.updateCategories = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error = new Error("Invalid category ID!");
    next(error);
    return;
  }
  const { name } = req.body;
  const updated = await Category.findByIdAndUpdate(
    id,
    { name: name },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updated) {
    let error = new Error("Category not exist!");
    next(error);
    return;
  }
  res.json({ status: "success", message: "Category updated!" });
});
