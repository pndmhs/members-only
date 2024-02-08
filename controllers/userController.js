const User = require("../models/user");
const Message = require("../models/message");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");

const bcrypt = require("bcrypt");

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

exports.home_get = asyncHandler(async (req, res, next) => {
  const messages = await Message.find().exec();
  res.render("index", {
    title: "Home | Members Only",
    user: req.user,
    messages: messages,
  });
});

exports.user_signup_get = asyncHandler(async (req, res, next) => {
  res.render("user_signup.ejs", {
    title: "Sign Up | Members Only",
    user: req.user,
    filledData: null,
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
    )
    .custom(async (value) => {
      const existingUser = await User.findOne({ username: value }).exec();
      if (existingUser) {
        throw new Error("Username has already been taken");
      }
      return true;
    }),
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
            user: req.user,
            filledData: user,
          });
          return;
        } else {
          await user.save();
          res.render("signup_success", {
            title: "Sign Up | Members Only",
            user: req.user,
          });
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

exports.join_club_get = asyncHandler(async (req, res, next) => {
  res.render("join_form", {
    title: "Join Member | Members Only",
    user: req.user,
  });
});

exports.join_club_post = [
  body("join_code")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Code must not be empty")
    .custom((value) => {
      if (value !== process.env.JOIN_CODE) {
        throw new Error("Code is not correct. Try again !");
      }
      return true;
    }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("join_form", {
        title: "Join Member | Members Only",
        user: req.user,
      });
      return;
    } else {
      const user = new User({
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        username: req.user.username,
        password: req.user.password,
        status: "member",
        _id: req.user._id,
      });
      await User.findByIdAndUpdate(req.user._id, user);
      res.render("congratulate_user", {
        title: "Join Member | Members Only",
        user: req.user,
      });
    }
  }),
];
