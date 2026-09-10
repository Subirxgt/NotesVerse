const sendToken = async (req, res, user, statusCode, message) => {
  const token = await user.generateToken();
  res.cookie("token", token, {
    expires: new Date(
      Date.now() +
        (process.env.COOKIE_EXPIRE
          ? process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
          : 7 * 24 * 60 * 60 * 1000) 
    ),
    httpOnly: true,
    sameSite: "lax", 
    secure: false,   
  });
  req.flash("success", message);
  return res.redirect("/");
};

module.exports = { sendToken };
