const asyncHandler = require("express-async-handler");
const Comment = require("../../models/Comments/Comments");
const Post = require("../../models/Posts/Post");

//@descripition: Create a new comment
//@route POST /api/v1/comments/:postId
//@access private
exports.createComment = asyncHandler(async (req, res, next) => {
  const pId = req.params.postId;
  const { message } = req.body;
  const post = await Post.findById(pId);
  if (!post) {
    let error = new Error("post not exist!");
    next(error);
    return;
  }
  //create comment
  const comment = await Comment.create({
    message,
    author: req.userAuth?._id,
    postId: pId,
  });

  //Associate comment with post
  const updatedPost = await Post.findByIdAndUpdate(
    pId,
    {
      $push: { comments: comment._id },
    },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "Comment created successfully.",
    post: updatedPost,
  });
});

//@descripition: Delete the comment
//@route DELETE /api/v1/comments/:commentId
//@access private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const commentId = req.params.commentId;

  // Find the comment
  const comment = await Comment.findById(commentId);
  if (!comment) {
    res.status(404);
    throw new Error("Comment does not exist.");
  }

  // Remove the comment from the associated post's comments array
  const post = await Post.findByIdAndUpdate(
    comment.postId,
    {
      $pull: { comments: comment._id },
    },
    { new: true }
  );

  // Delete the actual comment
  await Comment.findByIdAndDelete(commentId);

  res.json({
    status: "success",
    message: "Comment deleted successfully.",
    post,
  });
});

//@descripition: Update the comment
//@route PUT /api/v1/comments/:commentId
//@access private
exports.updateComment = asyncHandler(async (req, res, next) => {
  const commentId = req.params.commentId;
  const { message } = req.body;
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { message },
    { new: true, runValidators: true }
  );

  if (!updatedComment) {
    res.status(404);
    throw new Error("Comment does not exist.");
  }

  res.json({
    status: "success",
    message: "Comment updated successfully.",
    comment: updatedComment,
  });
});
