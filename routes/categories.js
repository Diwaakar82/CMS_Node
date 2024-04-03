const express = require("express");
const router = express.Router();
const { getCategories, createCategory, getCategory, updateCategory, deleteCategory } = require("../controllers/categories.js")

router.route("/").get(getCategories).post(createCategory);
router.route("/:id").put(updateCategory).patch(updateCategory).delete(deleteCategory);
router.route("/posts/:id").get(getCategory)

module.exports = router;