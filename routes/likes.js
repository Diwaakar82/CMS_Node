const express = require("express");
const router = express.Router();
const { createLike, deleteLike } = require("../controllers/likes.js");
const { validateToken } = require("../middlewares/generateAccessToken.js");

router.use(validateToken);
router.route("/:id/like").post(createLike);
router.route("/:id/like/:like_id").delete(deleteLike);

module.exports = router;
