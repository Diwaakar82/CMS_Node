const express = require("express");
const router = express.Router();
const { getPosts, createPost, getPost } = require("../controllers/posts.js")

router.route("/").get(getPosts).post(createPost);
router.route("/:id").get(getPost);

module.exports = router;