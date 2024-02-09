const Message = require("../models/message");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.message_create_get = asyncHandler(async (req, res, next) => {
  res.render("message_form.ejs", {
    title: "New Message | Members Only",
    user: req.user,
    message: null,
  });
});

exports.message_create_post = [
  body("title", "Title must be at least 3 character")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("message", "Message must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      text: req.body.message,
      user: req.user._id,
    });

    if (!errors.isEmpty()) {
      res.render("message_form", {
        title: "New Message | Members Only",
        message: message,
        user: req.user,
      });
    } else {
      await message.save();
      res.redirect("/");
    }
  }),
];

exports.message_delete_get = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).populate("user").exec();
  res.render("delete_message", {
    title: "Delete Message",
    user: req.user,
    message: message,
  });
});

exports.message_delete_post = asyncHandler(async (req, res, next) => {
  const message = Message.findById(req.params.id);

  if (message === null) {
    res.redirect("/");
  }

  await Message.findByIdAndDelete(req.params.id);
  res.redirect("/");
});
