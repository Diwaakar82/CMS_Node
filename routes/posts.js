const express = require("express");
const router = express.Router();
const { getPosts, createPost, getPost, updatePost, deletePost, createComment, getComment, updateComment, deleteComment } = require("../controllers/posts.js")
const { validateToken } = require("../middlewares/generateAccessToken.js");

router.use(validateToken);
router.route("/").get(getPosts).post(createPost);
router.route("/:id").get(getPost).put(updatePost).patch(updatePost).delete(deletePost);
router.route("/:post_id/comments").post(createComment);
router.route("/:post_id/comments/:id").get(getComment).put(updateComment).patch(updateComment).delete(deleteComment);

module.exports = router;