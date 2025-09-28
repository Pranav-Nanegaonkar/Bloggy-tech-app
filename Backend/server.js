const express = require("express");
const dotenv = require("dotenv");
const usersRouter = require("./routes/users/usersRouter");
const connectDB = require("./config/database");
const cors = require("cors");
const {
  notFound,
  globalErrorHandler,
} = require("./middlewares/globalErrorHandler");
const categoryRouter = require("./routes/categories/categoriesRouter");
const postRouter = require("./routes/posts/postsRouter");
const commentRouter = require("./routes/comments/commentsRouter");
const sendEmail = require("./utils/sendEmail");
const sendAccountVerificationEmail = require("./utils/sendVerificationEmail");

// sendEmail("nanegaonkarpranav68@gmail.com","Token@123");
// sendAccountVerificationEmail("nanegaonkarpranav68@gmail.com", "abc23443");
//!Create an express app
const app = express();

app.use(cors());

//!Load the enviroment variable
dotenv.config();

//!Connection to MongoDB
connectDB();

//!Set middleware
app.use(express.json());

//?Setup the user Router
app.use("/api/v1/users", usersRouter);

//?Setup the category Router
app.use("/api/v1/category", categoryRouter);

//?Setup the post Router
app.use("/api/v1/post", postRouter);

//?Setup the comment Router
app.use("/api/v1/comment", commentRouter);

//!Page Not Found
app.use(notFound);

//!Global Error Handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `------------Server is running on port: http://localhost:${PORT} ------------`
  );
});
