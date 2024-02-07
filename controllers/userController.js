const User = require("../models/user");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");

const bcrypt = require("bcrypt");

exports.home_get = asyncHandler(async (req, res, next) => {
  res.render("index", { title: "Home | Members Only", user: req.user });
});

exports.user_signup_get = asyncHandler(async (req, res, next) => {
  res.render("user_signup.ejs", {
    title: "Sign Up | Members Only",
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
  body("username")
    .trim()
    .isLength({ min: 4, max: 15 })
    .escape()
    .withMessage("Username must be between 4 and 15 characters")
    .not()
    .contains(" ")
    .withMessage("Username cannot contain spaces")
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage(
      "Username can only contain alphanumeric characters and underscores"
    ),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .escape()
    .withMessage("Password must be at least 8 character")
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
            title: "Sign Up | Members Only",
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

exports.user_login_get = asyncHandler(async (req, res, next) => {
  res.render("user_login", { title: "Login | Members Only", user: req.user });
});

exports.user_login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
});

exports.user_logout_get = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
