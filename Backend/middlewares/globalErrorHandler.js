const globalErrorHandler = (error, req, res, next) => {
  const statusCode = error?.statusCode || 500;
  const status = error?.status ? error.status : "Failure";
  const message = error?.message;
  const stack = error?.stack;
  res.status(statusCode).json({ status, message, stack });
};

const notFound = (req, res, next) => {
  let error = new Error(
    `Cannot find the route for ${req.originalUrl} at the server`
  );
  next(error);
};

module.exports = { globalErrorHandler, notFound };
