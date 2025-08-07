const express = require("express");
const categoryRouter = express.Router();
const {
  createCategory,
  getAllCategories,
  deleteCategories,
  updateCategories,
} = require("../../controllers/categories/categoriesControllers");
const isLoggedIn = require("../../middlewares/isLoggedin");

//!Create category
categoryRouter.post("/", isLoggedIn, createCategory);

//!Get all categories
categoryRouter.get("/", getAllCategories);

//!Delete category
categoryRouter.delete("/:id", isLoggedIn, deleteCategories);

//!Update category
categoryRouter.put("/:id", isLoggedIn, updateCategories);
module.exports = categoryRouter;
