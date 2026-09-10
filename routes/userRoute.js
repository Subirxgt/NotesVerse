const express = require("express");
const {
  forgotPassword,
  getUser,
  login,
  logout,
  registerForm,
  register,
  resetPassword,
  loginForm,
  forgotPasswordForm,
  resetPasswordForm,
  authForm,
  resendOtp,
} = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/auth");
const { otpVerificationForm } = require("../controllers/userController");
const { verifyOtp } = require("../controllers/userController");
const passport = require("passport");
const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/user/auth",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", `Welcome ${req.user.name}!`);
    res.redirect("/home");
  }
);

router.route("/auth").get(authForm);
router.route("/register").post(register);

router
  .route("/otpVerification/:email")
  .get(otpVerificationForm)
  .post(verifyOtp);

router.route("/resendOtp/:email").get(resendOtp);

router.route("/login").post(login);

router.get("/logout", logout);

router.get("/me", isAuthenticated, getUser);

router.route("/password/forgot").get(forgotPasswordForm).post(forgotPassword);
router
  .route("/password/reset/:token")
  .get(resetPasswordForm)
  .put(resetPassword);

module.exports = router;
