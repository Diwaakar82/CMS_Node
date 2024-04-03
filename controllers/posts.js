const connection = require("../models/db.js");

//@desc Show posts
//@route GET /posts
// @access public
const getPosts = (req, res) => {
    connection.query("SELECT * FROM POSTS", (err, results) => {
        if(err)
        {
            console.log("Error: getting posts");
            res.status(500).send('Internal Server Error');
        }
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
            const categoryInsertValues = category_ids.map(categoryId => [categoryId, postId]);

            connection.query("INSERT INTO CATEGORIES_POSTS VALUES ?", [categoryInsertValues], (err) => {
                if(err)
                {
                    console.log('Error inserting post:', err);
                    res.status(500).send('Internal Server Error');
                }
            });
        }

        res.status(200).json(result);
    });
};

//@desc Show post
//@route GET /posts/:id
//@access public
const getPost = (req, res) => {
    const postId = req.params.id;

    connection.query("SELECT * FROM POSTS WHERE id = ?", [postId], (err, result) => {
        if(err)
        {
            console.log("Error: getting post");
            res.status(500).send('Internal Server Error');
        }
        else
            res.status(200).json(result);
    });
};

//@desc Update post
//@route PATCH /posts/:id
//@access public
const updatePost = (req, res) => {
    const postId = req.params.id;
    const { title, description, category_ids } = req.body;

    connection.query("UPDATE POSTS SET title = ?, description = ? WHERE id = ?", [title, description, postId], (err, result) => {
        if(err)
        {
            console.log("Error: updating post");
            res.status(500).send('Internal Server Error');
        }

        connection.query("DELETE FROM CATEGORIES_POSTS WHERE post_id = ?", [postId], (err, result) => {
            if(err)
            {
                console.log("Error: updating post");
                res.status(500).send('Internal Server Error');
            }
        });

        if (category_ids && category_ids.length > 0)
        {
            const categoryInsertValues = category_ids.map(categoryId => [categoryId, postId]);

            connection.query("INSERT INTO CATEGORIES_POSTS VALUES ?", [categoryInsertValues], (err) => {
                if(err)
                {
                    console.log('Error inserting post:', err);
                    res.status(500).send('Internal Server Error');
                }
            });
        }

        res.status(200).json(result);
    });
};

//@desc Delete post
//@route DELETE /posts/:id
//@access public
const deletePost = (req, res) => {
    const postId = req.params.id;

    connection.query("DELETE FROM COMMENTS WHERE post_id = ?", [postId], (err, result) => {
        if(err)
        {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
    });

    connection.query("DELETE FROM CATEGORIES_POSTS WHERE post_id = ?", [postId], (err, result) => {
        if(err)
        {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
    });

    connection.query("DELETE FROM POSTS WHERE id = ?", [postId], (err, result) => {
        if(err)
        {
            console.log("Error: getting post");
            res.status(500).send('Internal Server Error');
        }
        else
            res.status(200).json(result);
    });
};

module.exports = { getPosts, createPost, getPost, updatePost, deletePost };