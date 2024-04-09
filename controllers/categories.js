const connection = require("../models/db.js");

//@desc Show categories
//@route GET /categories
//@access public
const getCategories = (req, res) => {
    connection.query("SELECT * FROM CATEGORIES", (err, results) => {
        if(err)
        {
            console.log("Error: getting categories");
            res.status(500).send('Internal Server Error');
        }
        else if(results.length)
            res.status(200).json(results);
        else
        res.status(404).send("No category found");
    });
};

//@desc Create category
//@route POST /categories
//@access public
const createCategory = (req, res) => {
    const { title } = req.body;

    connection.query("INSERT INTO CATEGORIES (title) VALUES (?)", [title], (err, result) => {
        if(err)
        {
            console.log('Error inserting category:', err);
            res.status(500).send('Internal Server Error');
        }
        else
            res.status(200).json(result);
    });
};

//@desc Show category
//@route GET /categories/posts/:id
//@access public
const getCategory = (req, res) => {
    const categoryId = req.params.id;

    connection.query("SELECT DISTINCT P.ID, P.TITLE, P.DESCRIPTION FROM POSTS P INNER JOIN CATEGORIES_POSTS CP ON P.ID = CP.post_id AND CP.category_id = ?", [categoryId], (err, result) => {
        if(err)
        {
            console.log('Error displaying category:', err);
            res.status(500).send('Internal Server Error');
        }
        else if(result.length)
            res.status(200).json(result);
        else
            res.status(404).send("No posts in category");
    });
};

//@desc Update category
//@route PATCH /categories/:id
//@access public
const updateCategory = (req, res) => {
    const categoryId = req.params.id;
    const { title } = req.body;

    connection.query("UPDATE CATEGORIES SET title = ? WHERE id = ?", [title, categoryId], (err, result) => {
        if(err)
        {
            console.log('Error updating category:', err);
            res.status(500).send('Internal Server Error');
        }
        else if(result.affectedRows)
            res.status(200).json(result);
        else
            res.status(404).send("No categories updated");
    });
};

//@desc Delete category
//@route DELETE /categories/:id
//@access public
const deleteCategory = (req, res) => {
    const categoryId = req.params.id;

    connection.query("DELETE FROM CATEGORIES_POSTS WHERE category_id = ?", [categoryId], (err, result) => {
        if(err)
        {
            console.log("Error: deleting join table", err);
            res.status(500).send('Internal Server Error');
        }
        else
        {
            connection.query("DELETE FROM CATEGORIES WHERE id = ?", [categoryId], (err, result) => {
                if(err)
                {
                    console.log("Error: deleting post", err);
                    res.status(500).send('Internal Server Error');
                }
                else if(result.affectedRows)
                    res.status(200).json(result);
                else
                    res.status(404).send("No categories deleted");
            });
        }
    });
};

module.exports = { getCategories, createCategory, getCategory, updateCategory, deleteCategory };