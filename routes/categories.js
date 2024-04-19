const express = require("express");
const router = express.Router();
const { getCategories, createCategory, getCategory, updateCategory, deleteCategory } = require("../controllers/categories.js");
const { validateToken } = require("../middlewares/generateAccessToken.js");

router.route("/").get(getCategories);
router.route("/posts/:id").get(getCategory);

router.use(validateToken);
router.route("/").post(createCategory);
router.route("/:id").put(updateCategory).patch(updateCategory).delete(deleteCategory);
module.exports = router;