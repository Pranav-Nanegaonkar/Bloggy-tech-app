const express = require("express");

const {
  register,
  login,
  getProfile,
  blockUser,
  getUser,
  unBlockUser,
  viewOtherProfile,
  followingUser,
  unFollowingUser,
  forgotPassword,
  resetPassword,
  accountVerificationEmail,
  verifyUser,
} = require("../../controllers/users/usersControllers");
const isLoggedIn = require("../../middlewares/isLoggedin");
const usersRouter = express.Router();

const multer = require("multer");
const storage = require("../../utils/fileUpload");

//? Config multer
const upload = multer({ storage });

//!Register route
usersRouter.post("/register", upload.single("file"), register);
//!Login route
usersRouter.post("/login", login);
//!Profile route
usersRouter.get("/profile", isLoggedIn, getProfile);
//!Get user route
usersRouter.get("/getuser/:userid", isLoggedIn, getUser);
//!Block user route
usersRouter.put("/block/:userIdTOBlock", isLoggedIn, blockUser);
//!Unblock user route
usersRouter.put("/unblock/:userIdToUnblock", isLoggedIn, unBlockUser);
//!View another profile route
usersRouter.put(
  "/view-another-profile/:userProfileId",
  isLoggedIn,
  viewOtherProfile
);

//!Follow another user route
usersRouter.put("/following/:userIdToFollow", isLoggedIn, followingUser);

//!Unfollow user route
usersRouter.put("/unfollowing/:userIdToUnFollow", isLoggedIn, unFollowingUser);

//!Forgot password route
usersRouter.post("/forgot-password", forgotPassword);

//!Reset password route
usersRouter.post("/reset-password/:resetToken", resetPassword);

//!Account Verification Email route
usersRouter.post("/account-verification", isLoggedIn, accountVerificationEmail);

//!Verifying User route
usersRouter.get("/verify-user/:verificationToken", isLoggedIn, verifyUser);

module.exports = usersRouter;
