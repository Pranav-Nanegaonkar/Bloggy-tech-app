const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Connected to database!");
    })
    .catch(() => {
      console.log("Faild to connect the database!");
    });
};
module.exports = connectDB;
 