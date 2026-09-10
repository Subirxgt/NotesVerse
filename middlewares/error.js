class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorMiddleWare = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    err = new ErrorHandler(`Invalid ${err.path}`, 400);
  }

  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler(`Json Web Token is invalid, Try Again!`, 400);
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler(`Json Web Token is expired, Try Again!`, 400);
  }

  if (err.code === 11000) {
    err = new ErrorHandler(`Duplicate ${Object.keys(err.keyValue)} Entered`, 400);
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(", ");
    err = new ErrorHandler(messages, 400);
  }

  req.flash("error", `❌ ${err.message}`);
  res.redirect(req.get("referrer") || "/");
};

module.exports = { ErrorHandler, errorMiddleWare };
