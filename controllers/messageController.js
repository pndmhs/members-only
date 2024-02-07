const Message = require("../models/user");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.message_create_get = asyncHandler(async (req, res, next) => {
  res.render("message_form.ejs", {
    title: "New Message | Members Only",
    user: req.user,
  });
});
