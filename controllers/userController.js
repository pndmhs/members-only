const User = require("../models/user");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const bcrypt = require("bcrypt");

exports.user_signup_get = asyncHandler(async (req, res, next) => {
  res.render("user_signup.ejs", {
    title: "Members Only | Sign Up",
    user: null,
  });
});

exports.user_signup_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("last_name").trim().escape(),
  body("username", "Username must be between 4 and 15 characters")
    .trim()
    .isLength({ min: 4, max: 15 })
    .escape()
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric"),
  body("password", "Password must be at least 8 character")
    .trim()
    .isLength({ min: 8 })
    .escape()
    .isAlphanumeric()
    .withMessage("Password must be alphanumeric"),
  body(
    "confirm_password",
    "The confirmation password does not match the original password"
  )
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        next(err);
      } else {
        const user = new User({
          firstName: req.body.first_name,
          lastName: req.body.last_name,
          username: req.body.username,
          password: hashedPassword,
        });

        if (!errors.isEmpty()) {
          res.render("user_signup", {
            title: "Members Only | Sign Up",
            user: user,
          });
        } else {
          await user.save();
          res.redirect("/sign-up");
        }
      }
    });
  }),
];