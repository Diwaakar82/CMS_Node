const express = require("express");
const router = express.Router();
const { getPosts, createPost, getPost, updatePost } = require("../controllers/posts.js")

router.route("/").get(getPosts).post(createPost);
router.route("/:id").get(getPost).put(updatePost).patch(updatePost);

module.exports = router;