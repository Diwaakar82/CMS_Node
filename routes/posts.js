const express = require("express");
const router = express.Router();
const { getPosts, createPost, getPost, updatePost, deletePost } = require("../controllers/posts.js")

router.route("/").get(getPosts).post(createPost);
router.route("/:id").get(getPost).put(updatePost).patch(updatePost).delete(deletePost);

module.exports = router;