const User = require("../models/user");

const asyncHandler = require("express-async-handler");

exports.user_signup_get = asyncHandler(async (req, res, next) => {
  res.render("user_signup.ejs", { title: "Members Only | Sign Up" });
});
