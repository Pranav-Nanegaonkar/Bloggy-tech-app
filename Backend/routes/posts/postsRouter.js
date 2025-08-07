const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedin");
const {
  createPost,
  getPost,
  getAllPost,
  deletePost,
  updatePost,
} = require("../../controllers/posts/postsControllers");
const postRouter = express.Router();

//!Create post route
postRouter.post("/", isLoggedIn, createPost);

//!Get single post
postRouter.get("/:id", isLoggedIn, getPost);

//!Get all post
postRouter.get("/", isLoggedIn, getAllPost);

//!Delete a post
postRouter.delete("/:id", isLoggedIn, deletePost);

//!Update a post
postRouter.put("/:id", isLoggedIn, updatePost);

module.exports = postRouter;
