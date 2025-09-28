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
    image: req.file.path,
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

  console.log("File Uploaded: ", req.file);
  res.send("Done");
});

//@descripition: Get single post
//@route GET /api/v1/post/:id
//@access public
exports.getPost = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error = new Error("Invalid post ID!");
    next(error);
    return;
  }
  const post = await Post.findById(id)
    .populate("author")
    .populate("category")
    .populate({
      path: "comments",
      model: "Comment",
      populate: {
        path: "author",
        select: "username",
      },
    });
  if (!post) {
    let error = new Error("post not exist!");
    next(error);
    return;
  }

  // post.postViews = post.postViews + 1;
  // console.log(post.postViews);

  const savedPost = await post.save();
  res.json({ status: "success", data: savedPost });
});

//@descripition: Get 4 posts
//@route GET /api/v1/post/public
//@access Public
exports.getPublicPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .limit(4)
    .populate({
      path: "category",
      model: "Category",
    })
    .populate({
      path: "author",
      model: "User",
      select: "username",
    });
  res.status(200).json({
    status: "success",
    message: "Post succesfully created / fetched ",
    posts,
  });
});

//@descripition: Get all posts
//@route GET /api/v1/post/
//@access private
exports.getAllPost = asyncHandler(async (req, res, next) => {
  // Get the current user id
  const currentUserId = req.userAuth._id;
  //Get all those users who blocked current user
  const usersBlockingCurrentUser = await User.find({
    blockedUsers: currentUserId,
  });
  //Extract the id of the users who have blocked the current user
  const blockingUsersIds = usersBlockingCurrentUser.map(
    (userObj) => userObj._id
  );
  // Fetch those posts whose author is not blockingUsersId
  const currentDateTime = new Date();
  const query = {
    author: { $nin: blockingUsersIds }, // ',' is and in mongoose
    $or: [
      {
        scheduledPublished: { $lte: currentDateTime },
        scheduledPublished: null,
      },
    ],
  };
  const allPosts = await Post.find(query)
    .populate("author")
    .populate("category");

  res.json({ status: "success", allPosts });
});

//@descripition: Delete a post
//@route DELETE /api/v1/post/:id
//@access private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error = new Error("Invalid post ID!");
    next(error);
    return;
  }
  const post = await Post.findById(id).populate("author");
  if (!post) {
    const error = new Error("Post does not exist");
    return next(error);
  }

  //? only the creater will delete the post
  if (req?.userAuth?._id.toString() === post?.author?._id.toString()) {
    // Update the user: remove the post from user's posts array
    const user = await User.findByIdAndUpdate(
      req.userAuth?._id,
      {
        $pull: { posts: post._id },
      },
      { new: true }
    );

    await Post.findByIdAndDelete(id);

    return res.json({ status: "success", message: "Post deleted!" });
  } else {
    return res.json({
      status: "failure",
      message: "user can only delete his post",
    });
  }
});

//@descripition: Update a post
//@route PUT /api/v1/post/:id
//@access private
exports.updatePost = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const { title, category, content } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error = new Error("Invalid post ID!");
    next(error);
    return;
  }
  const currentPost = await Post.findById(id);
  // console.log(req?.userAuth?._id.toString());
  // console.log(currentPost?.author?._id.toString());

  //? only the creater will update the post
  if (req?.userAuth?._id.toString() !== currentPost?.author?._id.toString()) {
    return res.json({
      status: "Failure",
      message: "The user is not the author of the current post",
    });
  }

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      image: req?.file?.path ? req?.file?.path : currentPost.image,
      title: title ? title : currentPost.title,
      category: category ? category : currentPost.category,
      content: content ? content : currentPost.content,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.json({ status: "success", message: "Post updated!", updatedPost });
});

//@descripition: Like a post
//@route PUT /api/v1/post/like/:postId
//@access private
exports.likePost = asyncHandler(async (req, res, next) => {
  //get the post id
  const { postId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    let error = new Error("Invalid post ID!");
    next(error);
    return;
  }
  //get current user
  const currentUserId = req.userAuth._id;
  //search post
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found!");
  }
  // add the current userId to likes array
  // await Post.findByIdAndUpdate(
  //   postId,
  //   {
  //     $addToSet: { likes: currentUserId },
  //   },
  //   { new: true }
  // );

  post.likes.addToSet(currentUserId);
  //if id in dislike remove the current userId from dislikes array
  post.dislikes.pull(currentUserId);
  const updatedPost = await post.save();

  res.json({
    status: "Success",
    message: "Post Liked",
    data: updatedPost,
  });
});

//@descripition: Dislike a post
//@route PUT /api/v1/post/dislike/:postId
//@access private
exports.disLikePost = asyncHandler(async (req, res, next) => {
  //get the post id
  const { postId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    let error = new Error("Invalid post ID!");
    next(error);
    return;
  }
  //get current user
  const currentUserId = req.userAuth._id;
  //search post
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found!");
  }
  // add the current userId to disikes array
  // await Post.findByIdAndUpdate(
  //   postId,
  //   {
  //     $addToSet: { likes: currentUserId },
  //   },
  //   { new: true }
  // );
  post.dislikes.addToSet(currentUserId);
  //if id in like remove the current userId from likes array
  post.likes.pull(currentUserId);
  const updatedPost = await post.save();

  res.json({
    status: "Success",
    message: "Post Disliked",
    data: updatedPost,
  });
});

//@descripition: view a post
//@route PUT /api/v1/post/view/:postId
//@access private
exports.viewPost = asyncHandler(async (req, res, next) => {
  //get the post id
  const { postId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    let error = new Error("Invalid post ID!");
    next(error);
    return;
  }
  //get current user
  const currentUserId = req.userAuth._id;
  //search post
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found!");
  }
  // add the current userId to likes array
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $addToSet: { postViews: currentUserId },
    },
    { new: true }
  );

  // post.postViews.addToSet(currentUserId);

  // const updatedPost1 = await updatedPost.save();

  res.json({
    status: "Success",
    message: "Post viewed",
    data: updatedPost,
  });
});

//@descripition: Clap a post
//@route PUT /api/v1/post/claps/:postId
//@access private
exports.clapPost = asyncHandler(async (req, res, next) => {
  //Get the id of the post
  const postId = req.params.postId;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    let error = new Error("Invalid post ID!");
    next(error);
    return;
  }
  //Get the post
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found!");
  }
  //Implements claps
  post.claps = post.claps + 1;
  const updatedPost = await post.save();

  res.json({
    status: "Success",
    message: "Post Clapped",
    data: updatedPost,
  });
});

//@descripition: schedule a post
//@route PUT /api/v1/post/schedule/:postId
//@access private
exports.schedulePost = asyncHandler(async (req, res, next) => {
  //Get the data
  const { postId } = req.params;
  const { scheduledPublish } = req.body;
  if (!postId || !scheduledPublish) {
    throw new Error("PostId and Schedule data aer required");
  }
  //Get the post
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found!");
  }
  //check if the current user is the author
  if (post.author.toString() !== req.userAuth._id.toString()) {
    throw new Error("You can schedule only your post!");
  }
  const scheduleDate = new Date(scheduledPublish);
  const currentDate = new Date();
  if (scheduleDate < currentDate) {
    throw new Error("Scheduled date cannot be previous date!");
  }
  post.scheduledPublished = scheduleDate;
  await post.save();

  res.json({
    status: "success",
    message: "Post scheduled successfully",
  });
});
