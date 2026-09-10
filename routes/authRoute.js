const express = require("express");
const { Router } = express;
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const token = await req.user.generateToken();
      res.cookie("token", token, {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      });
      res.redirect("https://studyadda.onrender.com/");
    } catch (error) {
      console.error("Callback Error:", error);
      res.redirect("https://studyadda.onrender.com/user/auth?error=true");
    }
  }
);
module.exports = router;
