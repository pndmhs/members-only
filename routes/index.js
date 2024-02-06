const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/userController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/sign-up", user_controller.user_signup_get);

module.exports = router;
