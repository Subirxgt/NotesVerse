const { catchAsyncError } = require("./catchAsyncError");
const { ErrorHandler } = require("./error");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

module.exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    req.flash("error", "⚠️ Please login to access this feature.");
    return res.redirect("/user/auth");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      req.flash("error", "⚠️ User not found. Please login again.");
      return res.redirect("/user/auth");
    }
    next();
  } catch (error) {
    req.flash("error", "⚠️ Session expired. Please login again.");
    return res.redirect("/user/auth");
  }
});
