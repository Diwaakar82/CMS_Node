const { resolve } = require("path");
const connection = require("../models/db.js");

//@desc Show posts
//@route GET /posts
//@access public
const getPosts = (req, res) => {
    connection.query("SELECT * FROM POSTS", (err, results) => {
        if(err)
        {
            console.log("Error: getting posts");
            res.status(500).send('Internal Server Error');
        }
        else
        {
            const posts = results.map(post => {
                return new Promise((resolve, reject) => {
                    connection.query("SELECT COUNT(*) AS LIKES FROM LIKES WHERE postId = ?", [post.ID], (error, result) => {
                        if(error)
                        {
                            console.log("Error: getting likes");
                            reject(error);  
                        }
                        else
                        {
                            post["LIKES"] = result[0]['LIKES'];
                            resolve();
                        }
                    })
                })  
            })
            Promise.all(posts)
            .then(() => {
                res.status(200).json(results);
            })
            .catch(error => {
                console.error("Error processing likes:", error);
                res.status(500).send('Internal Server Error');
            });
        }
    });
};

//@desc Create post
//@route POST /posts
//@access private
const createPost = (req, res) => {
    const { title, description, category_ids } = req.body;

    if(!title || !description)
    {
        res.status(400).send("All fields mandatory");
        return;
    }

    if(req.user.userId)
    {
        connection.query("INSERT INTO POSTS (title, description, userId) VALUES (?, ?, ?)", [title, description, req.user.userId], (err, result) => {
            if(err)
            {
                console.log('Error inserting post:', err);
                res.status(500).send('Internal Server Error');
                return;
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
                        return;
                    }

                    res.status(200).json(result);
                });
            }
            else
            {
                res.status(200).json(result);
            }
        });
    }
    else
    {
        res.status(403).send("Unauthorized users can't comment");
    }
};

//@desc Show post
//@route GET /posts/:id
//@access public
const getPost = (req, res) => {
    const postId = req.params.id;

    connection.query("SELECT * FROM POSTS WHERE id = ?", [postId], (err, results) => {
        if(err)
        {
            console.log("Error: getting post");
            res.status(500).send('Internal Server Error');
        }

        if (!result.length) 
        {
            res.status(404).json({ error: "Post not found" });
            return;
        }
        else
        {
            connection.query("SELECT COUNT(*) AS LIKES FROM LIKES WHERE postId = ?", [post.ID], (error, result) => {
                if(error)
                {
                    console.log("Error: getting likes");
                    res.status(500).send('Internal Server Error');  
                }
                else
                {
                    results["LIKES"] = result[0]['LIKES'];
                }
            })
        }

        connection.query("SELECT commenter, text FROM COMMENTS WHERE post_id = ?", [postId], (err, comments) => {
            if(err)
            {
                console.log("Error: getting comments");
                res.status(500).send('Internal Server Error');
            }

            if(comments.length)
            {
                result[0]["comments"] = comments;
            }
            res.status(200).json(result);
            console.log(result);
        });
    });
};

//@desc Update post
//@route PATCH /posts/:id
//@access private
const updatePost = (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const { title, description, category_ids } = req.body;

    connection.query("SELECT * FROM POSTS WHERE id = ?", [postId], (err, result) => {
        if(err)
        {
            console.log("Error: updating post");
            res.status(500).send('Internal Server Error');
            return;
        }

        if(!result.length)
        {
            res.status(404).send("Post doesn't exist");
            return;
        }

        if(result[0] && result[0].userId !== req.user.userId)
        {
            res.status(403).send("User can't update other user posts");
            return;
        }

        connection.query("UPDATE POSTS SET title = ?, description = ? WHERE id = ?", [title, description, postId], (err, result) => {
            if(err)
            {
                console.log("Error: updating post");
                res.status(500).send('Internal Server Error');
                return;
            }
    
            connection.query("DELETE FROM CATEGORIES_POSTS WHERE post_id = ?", [postId], (err, result) => {
                if(err)
                {
                    console.log("Error: updating post");
                    res.status(500).send('Internal Server Error');
                    return;
                }

                if (category_ids && category_ids.length > 0)
                {
                    const categoryInsertValues = category_ids.map(categoryId => [categoryId, postId]);
        
                    connection.query("INSERT INTO CATEGORIES_POSTS VALUES ?", [categoryInsertValues], (err) => {
                        if(err)
                        {
                            console.log('Error updating post:', err);
                            res.status(500).send('Internal Server Error');
                            return;
                        }

                        res.status(200).json(result);
                    });
                }
                else
                    res.status(200).json(result);
            }); 
        });
    });
};

//@desc Delete post
//@route DELETE /posts/:id
//@access private
const deletePost = (req, res) => {
    const postId = req.params.id;

    connection.query("SELECT * FROM POSTS WHERE id = ?", [postId], (err, result) => {
        if(err)
        {
            console.log("Error: updating post");
            res.status(500).send('Internal Server Error');
            return;
        }

        if(!result.length)
        {
            res.status(404).send("Post doesn't exist");
            return;
        }

        if(result[0] && result[0].userId !== req.user.userId)
        {
            res.status(403).send("User can't delete other user posts");
            return;
        }

        connection.query("DELETE FROM POSTS WHERE id = ?", [postId], (err, result) => {
            if(err)
            {
                console.log("Error: deleting post", err);
                res.status(500).send('Internal Server Error');
            }
            else
                res.status(200).json(result);
        });
    });
};

//@desc Create comment
//@route POST /posts/:post_id/comments
//@access private
const createComment = (req, res) => {
    const { text } = req.body;
    const postId = parseInt(req.params.post_id, 10);

    if(req.user.userId)
    {
        connection.query("INSERT INTO COMMENTS (commenter, text, post_id, userId) VALUES (?, ?, ?, ?)", [req.user.username, text, postId, req.user.userId], (err, result) => {
            if(err)
            {
                console.log('Error creating comment:', err);
                res.status(500).send('Internal Server Error');
            }

            res.status(200).json(result);
        });
    }
    else
    {
        res.status(403).send("Unauthorized users can't comment");
    }
};

//@desc Get comment
//@route GET /posts/:post_id/comments/:id
//@access public
const getComment = (req, res) => {
    const commentId = req.params.id;
    const postId = req.params.post_id;

    connection.query("SELECT commenter, text FROM COMMENTS WHERE id = ? AND post_id = ?", [commentId, postId], (err, result) => {
        if(err)
        {
            console.log('Error getting comment:', err);
            res.status(500).send('Internal Server Error');
        }

        res.status(200).json(result);
    });
};

//@desc Update comment
//@route PUT/PATCH /posts/:post_id/comments/:id
//@access private
const updateComment = (req, res) => {
    const commentId = req.params.id;
    const { text } = req.body;

    connection.query("SELECT * FROM COMMENTS WHERE id = ?", [commentId], (err, result) => {
        if(err)
        {
            console.log("Error: updating post");
            res.status(500).send('Internal Server Error');
            return;
        }

        if(result[0] && result[0].userId !== req.user.userId)
        {
            res.status(403).send("User can't update other user comments");
            return;
        }

        connection.query("UPDATE COMMENTS SET commenter = ?, text = ? WHERE id = ?", [req.user.username, text, commentId], (err, result) => {
            if(err)
            {
                console.log('Error updating comment:', err);
                res.status(500).send('Internal Server Error');
            }

            res.status(200).json(result);
        });
    });
};

//@desc Delete comment
//@route DELETE /posts/:post_id/comments/:id
//@access private
const deleteComment = (req, res) => {
    const commentId = req.params.id;

    connection.query("SELECT COMMENTS.userId AS C_uid, POSTS.userId AS P_uid FROM COMMENTS INNER JOIN POSTS ON COMMENTS.post_id = POSTS.id WHERE COMMENTS.id = ?", [commentId], (err, result) => {
        if(err)
        {
            console.log("Error: updating post");
            res.status(500).send('Internal Server Error');
            return;
        }

        if(result[0] && result[0].C_uid !== req.user.userId && result[0].P_uid !== req.user.userId)
        {
            res.status(403).send("User can't delete other user posts");
            return;
        }
        
        connection.query("DELETE FROM COMMENTS WHERE id = ?", [commentId], (err, result) => {
            if(err)
            {
                console.log('Error deleting comment:', err);
                res.status(500).send('Internal Server Error');
            }

            res.status(200).json(result);
        });
    });
};

module.exports = { getPosts, createPost, getPost, updatePost, deletePost, createComment, getComment, updateComment, deleteComment };