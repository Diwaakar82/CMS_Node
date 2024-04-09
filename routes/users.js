const express = require("express");
const router = express.Router();
const { signin, login, current_user } = require("../controllers/users.js");
const { validateToken } = require("../middlewares/generateAccessToken.js")

router.route("/signin").post(signin);
router.route("/login").post(login);
router.use(validateToken);
router.route("/current").get(current_user);

module.exports = router;