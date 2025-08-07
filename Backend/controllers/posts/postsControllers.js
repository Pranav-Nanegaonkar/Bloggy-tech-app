const asyncHandler = require("express-async-handler");
const Post = require("../../models/Posts/Post");
const User = require("../../models/Users/User");
const Category = require("../../models/Categories/Categories");
const { default: mongoose } = require("mongoose");

//@descripition: Create new post
//@route POST /api/v1/post/
//@access private
exports.createPost = asyncHandler(async (req, res, next) => {
  //get data from reqest body
  const { title, content, categoryId } = req.body;

  //check if the post is present
  const postFound = await Post.findOne({ title });

  if (postFound) {
    let error = new Error("Post is already exists!");
    next(error);
    return;
  }
  //create post object
  const post = await Post.create({
    title,
    content,
    category: categoryId,
    author: req.userAuth?._id,
  });

  //update user by adding post in it
  const user = await User.findByIdAndUpdate(
    req.userAuth?._id,
    {
      $push: { posts: post?._id },
    },
    { new: true }
  );

  //update category by adding post in it
  const catg = await Category.findByIdAndUpdate(
    categoryId,
    {
      $push: { posts: post?._id },
    },
    { new: true }
  );

  //send the responce
  res.json({
    status: "success",
    message: "Post succesfully created",
    user,
    catg,
  });
});

//@descripition: Get single post
//@route GET /api/v1/post/
//@access private
exports.getPost = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error = new Error("Invalid post ID!");
    next(error);
    return;
  }
  const post = await Post.findById(id);
  if (!post) {
    let error = new Error("post not exist!");
    next(error);
    return;
  }
  res.json({ status: "success", data: post });
});

//@descripition: Get all post
//@route GET /api/v1/post/
//@access private
exports.getAllPost = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find({});
  res.json({ status: "success", allPosts });
});

//@descripition: Delete a post
//@route DELETE /api/v1/post/
//@access private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const post = await Post.findById(id);
  if (!post) {
    const error = new Error("Post does not exist");
    return next(error);
  }

  // Update the user: remove the post from user's posts array
  const user = await User.findByIdAndUpdate(
    req.userAuth?._id,
    {
      $pull: { posts: post._id },
    },
    { new: true }
  );

  await Post.findByIdAndDelete(id);

  res.json({ status: "success", message: "Post deleted!" });
});

//@descripition: Update a post
//@route PUT /api/v1/post/
//@access private
exports.updatePost = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const post = req.body;

  const updatedPost = await Post.findByIdAndUpdate(id, post, {
    new: true,
    runValidators: true,
  });

  res.json({ status: "success", message: "Post updated!", updatedPost });
});
