const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedin");
const {
  createPost,
  getPost,
  getAllPost,
  deletePost,
  updatePost,
  likePost,
  disLikePost,
  clapPost,
  schedulePost,
} = require("../../controllers/posts/postsControllers");
const isVerified = require("../../middlewares/ifVerified");
const postRouter = express.Router();
const multer = require("multer");
const storage = require("../../utils/fileUpload");

//? Config multer
const upload = multer({ storage });

//!Create post route
postRouter.post("/", isLoggedIn, isVerified, upload.single("file"), createPost);

//!Get single post
postRouter.get("/:id", isLoggedIn, isVerified, getPost);

//!Get all post
postRouter.get("/", isLoggedIn, isVerified, getAllPost);

//!Delete a post
postRouter.delete("/:id", isLoggedIn, isVerified, deletePost);

//!Update a post
postRouter.put("/:id", isLoggedIn, isVerified, updatePost);

//!Like a post
postRouter.put("/like/:postId", isLoggedIn, isVerified, likePost);

//!Dislike a post
postRouter.put("/dislike/:postId", isLoggedIn, isVerified, disLikePost);

//!Clap a post
postRouter.put("/claps/:postId", isLoggedIn, isVerified, clapPost);

//!Schedule a post
postRouter.put("/schedule/:postId", isLoggedIn, isVerified, schedulePost);

module.exports = postRouter;
