const jwt = require("jsonwebtoken");
const User = require("../models/Users/User");
const isLoggedIn = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      const error = new Error(err?.message);
      next(error);
    } else {
      const userid = decoded?.user?.id;
      const user = await User.findById(userid).select(
        "username email role _id"
      );
      req.userAuth = user;
      next();
    }
  });
};
module.exports = isLoggedIn;
