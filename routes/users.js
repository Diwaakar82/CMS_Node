const express = require("express");
const router = express.Router();
const { signin, login, current_user } = require("../controllers/users.js");

router.route("/signin").post(signin);
router.route("/login").post(login);
router.route("/current").get(current_user);

module.exports = router;