const express = require("express");
const router = express.Router();
const { getPosts, createPost, getPost, updatePost, deletePost, createComment, getComment, updateComment, deleteComment } = require("../controllers/posts.js")
const { validateToken } = require("../middlewares/generateAccessToken.js");

//Public routes
router.route("/").get(getPosts)
router.route("/:id").get(getPost)
router.route("/:post_id/comments/:id").get(getComment)

//Private routes
router.use(validateToken);
router.route("/").post(createPost);
router.route("/:id(\\d+)").put(updatePost).patch(updatePost).delete(deletePost);
router.route("/:post_id/comments").post(createComment);
router.route("/:post_id/comments/:id").put(updateComment).patch(updateComment).delete(deleteComment);

module.exports = router;