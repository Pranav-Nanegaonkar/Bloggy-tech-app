const bcrypt = require("bcryptjs");
const User = require("../../models/Users/User");
const generateToken = require("../../utils/generateToken");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../../utils/sendEmail");
const crypto = require("crypto");
const { error } = require("console");
const sendAccountVerificationEmail = require("../../utils/sendVerificationEmail");

//@descripition: Register new User
//@route POST /api/v1/users/register
//@access public
exports.register = asyncHandler(async (req, res, next) => {
  const { username, password, email } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("User Already Exists!");
  }
  const newUser = new User({
    username,
    email,
    password,
  });
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);
  await newUser.save();

  return res.status(201).json({
    status: "success",
    message: "User registered successfully",
    _id: newUser.id,
    username: newUser.username,
    role: newUser.role,
  });
});

//@descripition: Login User
//@route: POST /api/v1/users/login
//@access public
exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("Invalid Credentials!");
  }

  const flag = await bcrypt.compare(password, user.password);
  if (!flag) {
    throw new Error("Invalid Credentials!");
  }
  user.lastlogin = new Date();
  await user.save();
  const token = await generateToken(user);
  return res.status(200).json({
    status: "Success",
    message: "User logged in succesfully",
    email: user?.email,
    _id: user?._id,
    username: user?.username,
    role: user?.role,
    token: token,
  });
});

//@descripition: Profile view
//@route GET /api/v1/users/profile/:id
//@access private
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userAuth?.id)
    .populate({
      path: "profileViewers followers following blockedUsers",
      model: "User",
      select: "username email role",
    })
    .populate({
      path: "posts",
      model: "Post",
    });
  if (!user) {
    let error = new Error("User not loged in");
    next(error);
    return;
  }
  res.json({
    status: "success",
    message: "Profile fetched",
    data: "dummy user",
    user,
  });
});

//@descripition: Get User
//@route GET /api/v1/users/getuser/:userid
//@access private
exports.getUser = asyncHandler(async (req, res, next) => {
  const userid = req.params.userid;
  const user = await User.findById(userid);
  if (!user) {
    let error = new Error("User not exist");
    next(error);
    return;
  }
  res.json({
    status: "success",
    message: "User found",
    user,
  });
});

//@descripition: Block user
//@route PUT /api/v1/users/block/:userIdTOBlock
//@access private
exports.blockUser = asyncHandler(async (req, res, next) => {
  //?Find userid to block
  const userIdTOBlock = req.params.userIdTOBlock;
  //?Check user is present in DB or not
  const userTOBlock = await User.findById(userIdTOBlock);
  if (!userTOBlock) {
    throw new Error("User does not exist!");
  }
  //?Get the current user id
  const userBlockingId = req.userAuth?._id;

  //?Check if it is self blocking
  // userBlockingId === userIdTOBlock failed bcz it is a object
  if (userBlockingId.toString() === userIdTOBlock.toString()) {
    throw new Error("User cannot block himself");
  }

  //?Get the current user by userBlockingId
  const currentUser = await User.findById(userBlockingId);

  //?Check whether the useidtoblock is already present in blockedUsers
  if (currentUser.blockedUsers.includes(userIdTOBlock)) {
    throw new Error("This user has already been blocked!");
  }

  //?Push the element to be blocked in currentUser blockedUsers array
  currentUser.blockedUsers.push(userIdTOBlock);
  await currentUser.save();

  res.json({
    status: "success",
    message: "User blocked successfuly",
  });
});

//@descripition: Unblock user
//@route PUT /api/v1/users/unblock/:userIdToUnblock
//@access private
exports.unBlockUser = asyncHandler(async (req, res, next) => {
  //?Find userid to unblock
  const userIdToUnblock = req.params.userIdToUnblock;
  //?Check user is present in DB or not
  const userToUnblock = await User.findById(userIdToUnblock);
  if (!userToUnblock) {
    throw new Error("User does not exist!");
  }
  //?Get the current user id
  const userBlockingId = req.userAuth?._id;

  //?Check if it is self unblocking
  // userBlockingId === userIdToUnblock failed bcz it is a object
  if (userBlockingId.toString() === userIdToUnblock.toString()) {
    throw new Error("User cannot unblock himself");
  }

  //?Get the current user by userBlockingId
  const currentUser = await User.findById(userBlockingId);

  //?Check whether the useidtoblock is already present in blockedUsers
  if (!currentUser.blockedUsers.includes(userIdToUnblock)) {
    throw new Error("This user is not blocked!");
  }

  //?Pull the element from the currentUser blockedUsers array
  currentUser.blockedUsers.pull(userIdToUnblock);
  await currentUser.save();

  res.json({
    status: "success",
    message: "User unblocked successfuly",
  });
});

//@descripition: View another user profile
//@route put /api/v1/users/view-another-profile/:userProfileId
//@access private
exports.viewOtherProfile = asyncHandler(async (req, res, next) => {
  //get the userid whoes profile to be viewed
  const userProfileId = req.params.userProfileId;
  const userProfile = await User.findById(userProfileId);
  if (!userProfile) {
    throw new Error("User does not exist!");
  }
  //Get the current user
  const currentUserId = req?.userAuth?._id;

  // Avoid viewing himself
  if (currentUserId.toString() === userProfileId.toString()) {
    throw new Error("You are viewing your profile!");
  }

  //check the currentUserId is available in the userProfile's profileViewers array
  if (userProfile.profileViewers.includes(currentUserId)) {
    throw new Error("You have already viewed the profile!");
  }
  //Push the currentUserId into array of userProfile
  userProfile.profileViewers.push(currentUserId);
  await userProfile.save();

  res.json({
    status: "success",
    message: "Profile successfully viewed",
  });
});

//@descripition: Follow user
//@route PUT /api/v1/users/following/:userIdToFollow
//@access private
exports.followingUser = asyncHandler(async (req, res, next) => {
  const currentUserId = req?.userAuth?._id;
  const userIdToFollow = req.params.userIdToFollow;

  if (currentUserId.toString() === userIdToFollow.toString()) {
    throw new Error("You cannot follow yourself.");
  }

  const currentUser = await User.findById(currentUserId);
  const userProfile = await User.findById(userIdToFollow);

  if (!userProfile) {
    throw new Error("The user you are trying to follow does not exist.");
  }

  if (currentUser.following.includes(userIdToFollow)) {
    throw new Error("You are already following this user.");
  }

  // Add to following/followers
  currentUser.following.push(userIdToFollow);
  await currentUser.save();

  userProfile.followers.push(currentUserId);
  await userProfile.save();

  res.status(200).json({
    status: "success",
    message: "You have followed the user.",
  });
});

//@descripition: Follow user
//@route PUT /api/v1/users/unfollowing/:userIdToUnFollow
//@access private
exports.unFollowingUser = asyncHandler(async (req, res, next) => {
  const currentUserId = req?.userAuth?._id;
  const userIdToUnFollow = req.params.userIdToUnFollow;

  const currentUser = await User.findById(currentUserId);
  const userProfile = await User.findById(userIdToUnFollow);

  if (!userProfile) {
    throw new Error("The user you are trying to unfollow does not exist.");
  }

  if (!currentUser.following.includes(userIdToUnFollow)) {
    throw new Error("You are not following this user.");
  }

  // Remove from following/followers
  currentUser.following.pull(userIdToUnFollow);
  await currentUser.save();

  userProfile.followers.pull(currentUserId);
  await userProfile.save();

  res.status(200).json({
    status: "success",
    message: "You have unfollowed the user.",
  });
});

//@descripition: Forgot password
//@route POST /api/v1/users/forgot-password
//@access public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //?Fetch the email
  const { email } = req.body;

  //?Find email in the DB
  const userFound = await User.findOne({ email });
  if (!userFound) {
    throw new Error("This email is not registered with us");
  }
  //?Get the reset token
  const resetToken = await userFound.generatePasswordResetToken();

  //? Save the changes (resetToken and exiryTime) to the DB
  await userFound.save();
  //sending the mail
  sendEmail(email, resetToken);
  //Sending the response
  res.json({
    status: "success",
    message: "Password reset token sent to your email successfully",
  });
});

//@descripition: Reset password
//@route POST /api/v1/users/reset-password/:resetToken
//@access public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //get token from params
  const resetToken = req.params.resetToken;

  //get the password
  const { password } = req.body;
  //Convert resetToken into hashed token
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //verify the token with DB
  const userFound = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!userFound) {
    throw new Error("Password reset token is invalid or expired");
  }
  //Update the new password
  const salt = await bcrypt.genSalt(10);
  userFound.password = await bcrypt.hash(password, salt);
  userFound.passwordResetToken = undefined;
  userFound.passwordResetExpires = undefined;

  await userFound.save();

  res.json({
    status: "success",
    message: "Password has been changed successfully",
  });
});

//@descripition: Send account verification mail
//@route POST /api/v1/users/account-verification
//@access private
exports.accountVerificationEmail = asyncHandler(async (req, res, next) => {
  //current user mail id
  const currentUserId = req?.userAuth?._id;
  const user = await User.findById(currentUserId);
  if (!user) {
    throw new Error("You are not logged in!");
  }
  const email = user?.email;
  // get the token from user object
  const verificationToken = await user.generateAccountVerificationToken();
  await user.save();
  sendAccountVerificationEmail(email, verificationToken);
  res.json({
    status: "success",
    message: "Account verification token sent to your email successfully",
  });
});

//@descripition: Verify the user by verification token
//@route GET /api/v1/users/verify-user/:verificationToken
//@access private
exports.verifyUser = asyncHandler(async (req, res, next) => {
  const verificationToken = req.params.verificationToken;

  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  // current user
  const user = await User.findOne({
    accountVerificationTokent: hashedToken,
    accountVerificationExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Account verification token is invalid or expired!");
  }
  user.isVerified = true;
  user.accountVerificationTokent = undefined;
  user.accountVerificationExpires = undefined;
  await user.save();
  res.json({
    status: "success",
    message: "User is verified succesfully",
  });
});
