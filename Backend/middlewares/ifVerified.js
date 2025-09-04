const User = require("../models/Users/User");

const isVerified = async (req, res, next) => {
  const currentUserId = req.userAuth._id;
  const user = await User.findById(currentUserId);
  if (!user) {
    throw new Error("user not found");
  }
  
  if (!user.isVerified) {
    throw new Error("You are not verified!");
  }
  next();
};

module.exports = isVerified;
