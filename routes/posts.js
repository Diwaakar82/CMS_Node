const express = require("express");
const router = express.Router();
const { getPosts, createPost } = require("../controllers/posts.js")

router.route("/").get(getPosts).post(createPost);

module.exports = router;