const mongoose = require("mongoose");
const crypto = require("crypto");
//!Creating User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
    lastlogin: {
      type: Date,
      default: Date.now(),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    accountLevel: {
      type: String,
      enum: ["bronze", "silver", "gold"],
      default: "bronze",
    },
    profilePicture: {
      type: String,
      default: "https://res.cloudinary.com/dzuoyswp0/image/upload/v1757699802/145856997_296fe121-5dfa-43f4-98b5-db50019738a7_1_oljo2s.jpg",
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    notification: {
      email: { type: String },
    },
    gender: {
      type: String,
      enum: ["male", "female", "prefer not to say", "non-binary"],
    },
    //other properties will deal with relationship
    profileViewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    accountVerificationTokent: {
      type: String,
    },
    accountVerificationExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  //Tell Mongoose these fields were modified
  this.markModified("passwordResetToken");
  this.markModified("passwordResetExpires");

  return resetToken;
};
userSchema.methods.generateAccountVerificationToken = function () {
  const verificationToken = crypto.randomBytes(20).toString("hex");

  this.accountVerificationTokent = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.accountVerificationExpires = Date.now() + 10 * 60 * 1000;

  return verificationToken;
};
//!Convert Schema to model
const User = mongoose.model("User", userSchema);

//!Export the model
module.exports = User;
