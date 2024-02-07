const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/userController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/sign-up", user_controller.user_signup_get);

router.post("/sign-up", user_controller.user_signup_post);

router.get("/login", user_controller.user_login_get);

router.post("/login", user_controller.user_login_post);

router.get("/user-home", user_controller.user_home_get);

module.exports = router;
