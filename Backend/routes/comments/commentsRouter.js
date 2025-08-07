const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedin");
const {
  createComment,
  deleteComment,
  updateComment,
} = require("../../controllers/comments/commentsControllers");
const commentRouter = express.Router();

//!Create comment route
commentRouter.post("/:postId", isLoggedIn, createComment);

//!Delete a comment route
commentRouter.delete("/:commentId", isLoggedIn, deleteComment);

//!Update a comment route
commentRouter.put("/:commentId", isLoggedIn, updateComment);

module.exports = commentRouter;
