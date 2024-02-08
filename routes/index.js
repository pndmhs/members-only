const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

/* GET home page. */
router.get("/", user_controller.home_get);

router.get("/sign-up", user_controller.user_signup_get);

router.post("/sign-up", user_controller.user_signup_post);

router.get("/login", user_controller.user_login_get);

router.post("/login", user_controller.user_login_post);

router.get("/log-out", user_controller.user_logout_get);

router.get("/new-message", message_controller.message_create_get);

router.post("/new-message", message_controller.message_create_post);

router.get("/join-club", user_controller.join_club_get);

router.post("/join-club", user_controller.join_club_post);

router.get("/become-admin", user_controller.become_admin_get);

module.exports = router;
