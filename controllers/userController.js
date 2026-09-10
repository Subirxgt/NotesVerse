const mongoose = require("mongoose");
const {ErrorHandler} = require("../middlewares/error");
const { catchAsyncError } = require("../middlewares/catchAsyncError");
const { sendEmail } = require("../utils/sendEmail");
const { sendToken } = require("../utils/sendToken");
const crypto = require("crypto");
const { stat } = require("fs");
const User = require("../models/users");
const path = require("path")

module.exports.authForm = catchAsyncError(async (req, res, next) => {
  try {
    if (req.user) {
      req.flash("success", "You are already logged in!");
      return res.redirect("/");
    }
    res.render("auth.ejs", {
      title: "Login or Register | StudyAdda",
      user: req.user || null,
    });
  } catch (err) {
    console.error("Auth page error:", err);
    req.flash("error", "Unable to load login/register page.");
    res.redirect("/");
  }
});


module.exports.otpVerificationForm = (req, res) => {
    console.log("✅ OTP verification route hit");
    const { email } = req.params;
    console.log("Email param:", email);
    res.render("otpVerification.ejs",{email});
};

module.exports.register = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(name,email,password);
    if (!name || !email || !password) {
      req.flash("error", "⚠️ All fields are required.");
      return res.redirect("/user/auth");
    }
    const existingUser = await User.findOne({ email, accountVerified: true });
    if (existingUser) {
      req.flash("error", "❌ This email is already registered. Please log in instead.");
      return res.redirect("/user/auth");
    }
    const unverifiedAttempts = await User.find({ email, accountVerified: false });
    if (unverifiedAttempts.length > 15) {
      req.flash(
        "error",
        "🚫 Too many registration attempts. Please try again after an hour."
      );
      return res.redirect("/user/auth");
    }
    const user = await User.create({ name, email, password });
    const verificationCode = await user.generateVerificationCode();
    user.verificationCode = verificationCode;
    await user.save();
    await sendVerificationCode(verificationCode, email);
    req.flash(
      "success",
      "🎉 Registration successful! Please check your email inbox (or spam folder) for the OTP to verify your account."
    );
    return res.redirect(`/user/otpVerification/${email}`);
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("error", "❌ Something went wrong. Please try again later.");
    return res.redirect("/user/auth");
  }
});


async function sendVerificationCode(verificationCode,email){
    const message=await messageTemplate(verificationCode);
    try{
        sendEmail({email,subject:"Your Verification Code",message});
    }
    catch(error){
        console.log(error.message);
    }
};

async function messageTemplate(verificationCode){
    return `
    <div style="margin:0; padding:0; background-color:#f2f6fb; font-family:Arial, Helvetica, sans-serif; -webkit-text-size-adjust:none;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f2f6fb; padding:24px 12px;">
            <tr>
            <td align="center">

                <!-- outer wrapper -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(20,40,80,0.06);">
                
                <!-- header -->
                <tr>
                    <td style="background:linear-gradient(90deg,#6c63ff,#00c6ff); padding:16px 18px; color:#ffffff;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                        <td valign="middle" style="width:52px;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width:44px; height:44px; border-radius:22px; background:rgba(255,255,255,0.18); text-align:center;">
                            <tr>
                                <td style="font-weight:700; font-size:18px; color:#ffffff;">S</td>
                            </tr>
                            </table>
                        </td>
                        <td valign="middle" style="padding-left:12px;">
                            <div style="font-weight:700; font-size:16px; color:#ffffff;">StudyAdda</div>
                            <div style="font-size:12px; color:rgba(255,255,255,0.9); margin-top:2px;">Secure account verification</div>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>

                <!-- body -->
                <tr>
                    <td style="padding:28px 28px 18px 28px; text-align:center; color:#222b45;">
                    <div style="font-size:18px; font-weight:700; margin-bottom:8px;">Email Verification</div>
                    <div style="font-size:14px; color:#58607a; margin-bottom:20px;">
                        Use the code below to verify your email for <strong>StudyAdda</strong>.
                    </div>

                    <!-- verification code -->
                    <div style="display:inline-block; background-color:#0b1226; color:#ffffff; font-family:monospace; font-size:22px; letter-spacing:6px; padding:12px 26px; border-radius:8px; box-shadow:0 6px 18px rgba(11,18,38,0.12);">
                        ${verificationCode}
                    </div>

                    <div style="font-size:13px; color:#7b8094; margin-top:18px;">
                        Enter this code in the StudyAdda app to complete verification.
                    </div>

                    <div style="font-size:12px; color:#9aa2bb; margin-top:8px;">
                        If you didn't request this, you can safely ignore this email.
                    </div>
                    </td>
                </tr>

                <!-- footer -->
                <tr>
                    <td style="padding:14px 18px; background-color:#fbfdff; text-align:center; font-size:12px; color:#9aa2bb;">
                    © StudyAdda — All rights reserved.
                    </td>
                </tr>

                </table>
                <!-- end outer wrapper -->

            </td>
            </tr>
        </table>
    </div>`;
}

module.exports.verifyOtp = catchAsyncError(async (req, res, next) => {
  try {
    const { email } = req.body;
    const otp = Array.isArray(req.body.otp) ? req.body.otp.join("") : req.body.otp;

    if (!email || !otp) {
      req.flash("error", "⚠️ Please enter your email and OTP.");
      return res.redirect(`/user/otpVerification/${email}`);
    }
    const allUserEntries = await User.find({ email, accountVerified: false }).sort({ createdAt: -1 });

    if (!allUserEntries || allUserEntries.length === 0) {
      req.flash("error", "❌ User not found or already verified.");
      return res.redirect("/user/auth");
    }
    let user = allUserEntries[0];
    if (allUserEntries.length > 1) {
      await User.deleteMany({
        _id: { $ne: user._id },
        email,
        accountVerified: false,
      });
    }
    if (user.verificationCode !== Number(otp)) {
        console.log(Number(otp));
      req.flash("error", "❌ Invalid OTP. Please try again.");
      return res.redirect(`/user/otpVerification/${email}`);
    }
    const currentTime = Date.now();
    const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();

    if (currentTime > verificationCodeExpire) {
      req.flash("error", "⏰ OTP has expired. Please register again.");
      await User.deleteOne({ _id: user._id });
      return res.redirect("/user/auth");
    }
    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save({ validateModifiedOnly: true });
    req.flash("success", `🎉 Account verified successfully! Welcome, ${user.name}`);
    sendToken(req, res, user, 200, "🎉 Account verified and logged in successfully!");

  } catch (error) {
    console.error("OTP verification error:", error);
    req.flash("error", "❌ Internal server error. Please try again later.");
    return res.redirect(`/user/otpVerification/${req.body.email}`);
  }
});

module.exports.resendOtp = catchAsyncError(async (req, res, next) => {
  try {
    const { email } = req.params;
    const existingUser = await User.findOne({ email, accountVerified: true });
    if (existingUser) {
      req.flash("error", "❌ This email is already registered. Please log in instead.");
      return res.redirect("/user/register");
    }
    const user = await User.findOne({ email, accountVerified: false })
                           .sort({ createdAt: -1 });

    if (!user) {
      req.flash("error", "⚠️ No unverified account found with this email. Please register again.");
      return res.redirect("/user/register");
    }

    await User.deleteMany({ email, accountVerified: false, _id: { $ne: user._id } });

    const attemptsCount = await User.countDocuments({ email, accountVerified: false });
    if (attemptsCount > 10) {
      req.flash("error", "🚫 Too many OTP requests. Please try again after an hour.");
      return res.redirect("/user/register");
    }
    const verificationCode = await user.generateVerificationCode();
    user.verificationCode = verificationCode;
    await user.save();

    await sendVerificationCode(verificationCode, email);

    req.flash(
      "success",
      "🎉 OTP resent! Please check your email inbox (or spam folder) for the OTP to verify your account."
    );

    return res.redirect(`/user/otpVerification/${email}`);
  } catch (error) {
    console.error("Resend OTP error:", error);
    req.flash("error", "❌ Something went wrong while resending OTP. Please try again later.");
    return res.redirect("/user/register");
  }
});


module.exports.login = catchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash("error", "⚠️ Email and password are required.");
      return res.redirect("/user/auth");
    }

    const user = await User.findOne({ email, accountVerified: true }).select("+password");
    if (!user) {
      req.flash("error", "❌ Invalid email or password.");
      return res.redirect("/user/auth");
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      req.flash("error", "❌ Invalid email or password.");
      return res.redirect("/user/auth");
    }

    sendToken(req, res, user, 200, "✅ Logged in successfully!");

  } catch (error) {
    console.error("Login error:", error);
    req.flash("error", "❌ Something went wrong. Please try again.");
    return res.redirect("/user/auth");
  }
});



module.exports.logout = catchAsyncError(async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        req.flash("error", "❌ Logout failed. Please try again.");
        return res.redirect("/");
      }

      req.flash("success", "👋 Logged out successfully. You are now browsing as a guest.");
      res.redirect("/");
    });
  } catch (error) {
    console.error("Logout error:", error);
    req.flash("error", "❌ Logout failed. Please try again.");
    res.redirect("/");
  }
});



module.exports.getUser=catchAsyncError(async(req,res,next)=>{
    const user=req.user;
    res.status(200).json({
        success:true,
        user,
    })
});

module.exports.forgotPasswordForm=(req,res)=>{
    res.render("forgotPassword.ejs");
}

module.exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      req.flash("error", "⚠️ Please enter your email address.");
      return res.redirect("/user/password/forgot");
    }
    const user = await User.findOne({ email, accountVerified: true });
    if (!user) {
      req.flash("error", "❌ No verified account found with this email.");
      return res.redirect("/user/password/forgot");
    }
    const resetToken = await user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${
      process.env.BASE_URL || "http://localhost:8080"
    }/user/password/reset/${resetToken}`;
    const message = `
    <div style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial, Helvetica, sans-serif;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr><td align="center" style="padding:24px 12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
            <tr>
              <td align="center" style="background-color:#2563eb;padding:20px 0;">
                <h1 style="margin:0;color:#ffffff;font-size:24px;">StudyAdda</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 32px 20px 32px;color:#333333;font-size:15px;line-height:1.6;">
                <p style="margin:0 0 12px 0;">Hello,</p>
                <p style="margin:0 0 16px 0;">We received a request to reset your password for your <strong>StudyAdda</strong> account.</p>
                <p style="margin:0 0 16px 0;">Click the button below to reset your password and regain access to your account:</p>
                <p style="margin:28px 0;text-align:center;">
                  <a href="${resetPasswordUrl}" target="_blank" rel="noopener"
                  style="background-color:#2563eb;color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
                    Reset Password
                  </a>
                </p>
                <p style="margin:0 0 12px 0;color:#6b7280;font-size:13px;">
                  If the button above doesn’t work, copy and paste this link into your browser:
                </p>
                <p style="word-break:break-all;font-size:13px;color:#064e3b;margin:8px 0 20px 0;">
                  <a href="${resetPasswordUrl}" target="_blank" rel="noopener" style="color:#064e3b;text-decoration:none;">${resetPasswordUrl}</a>
                </p>
                <p style="margin:0 0 6px 0;color:#6b7280;font-size:13px;">
                  If you didn’t request a password reset, please ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color:#f1f5f9;padding:18px 20px;color:#6b7280;font-size:13px;">
                <p style="margin:0;">Thanks,<br><strong>The StudyAdda Team</strong></p>
                <p style="margin:8px 0 0 0;font-size:12px;color:#9aa0a6;">
                  © ${new Date().getFullYear()} StudyAdda. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </div>`;

    await sendEmail({
      email: user.email,
      subject: "🔒 Reset Your StudyAdda Password",
      message,
    });
    req.flash(
      "success",
      "✅ Password reset link has been sent to your registered email. Please check your inbox (and spam folder)."
    );
    res.redirect("/");
  } catch (error) {
    console.error("Forgot Password Error:", error);

    if (error && error.user) {
      error.user.resetPasswordToken = undefined;
      error.user.resetPasswordTokenExpire = undefined;
      await error.user.save({ validateBeforeSave: false });
    }

    req.flash(
      "error",
      "❌ Unable to send reset link. Please try again later or contact support."
    );
    res.redirect("/user/password/forgot");
  }
});


module.exports.resetPasswordForm=(req,res)=>{
    const { token } = req.params;
    res.render("resetPassword", { token });
}

module.exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    req.flash("error", "❌ Reset password link is invalid or expired.");
    return res.redirect("/user/password/forgot");
  }

  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    req.flash("error", "⚠️ Password and Confirm Password do not match.");
    return res.redirect(`/user/password/reset/${token}`);
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save();

  req.flash("success", "✅ Password reset successful! You can now log in.");
  res.redirect("/user/auth");
});