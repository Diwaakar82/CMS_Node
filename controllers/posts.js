const connection = require("../models/db.js");

//@desc Show posts
//@route GET /posts
// @access public
const getPosts = (req, res) => {
    connection.query("SELECT * FROM posts", (err, results) => {
        if(err)
            console.log("Error");
        else
            res.status(200).json(results);
    });
};

//@desc Create post
//@route POST /posts
//@access public
const createPost = (req, res) => {
    const { title, description, category_ids } = req.body;

    connection.query("INSERT INTO POSTS (title, description) VALUES (?, ?)", [title, description], (err, result) => {
        if(err)
        {
            console.log('Error inserting post:', err);
            res.status(500).send('Internal Server Error');
        }

        const postId = result.insertId;

        if (category_ids && category_ids.length > 0)
        {
            const categoryInsertValues = category_ids.map(categoryId => [postId, categoryId]);

            connection.query("INSERT INTO CATEGORIES_POSTS VALUES ?", [categoryInsertValues], (err) => {
                if(err)
                {
                    console.log('Error inserting post:', err);
                    res.status(500).send('Internal Server Error');
                }
            })
        }

        res.status(200).json(result);
    })
}

module.exports = { getPosts, createPost };