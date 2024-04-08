const connection = require("../models/db.js");
const { already_liked } = require("../middlewares/checkLike.js");
// const { connect } = require("../routes/users.js");

//@desc Like post
//@route POST /posts/:id/like
//@access private
const createLike = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.userId;

    // console.log(req.params);
    if(userId)
    {
        already_liked(postId, userId)
            .then((flag) => {
                if(flag)
                {
                    res.status(400).send("Already liked");
                }
                else
                {
                    connection.query("INSERT INTO LIKES(postId, userId) VALUES (?, ?)", [postId, userId], (err) => {
                        if(err)
                        {
                            console.log("Error: getting like id");
                            res.status(500).send('Internal Server Error');
                        }
                        else
                        {
                            res.status(200).send("Liked post");
                        }
                    });
                }
            })
            .catch((err) => {
                console.error("Error:", err);
                res.status(500).send('Internal Server Error');
            });
    }
};

//@desc Like post
//@route POST /posts/:id/like/:like_id
//@access private
const deleteLike = (req, res) => {
    const likeId = req.params.like_id;

    connection.query("SELECT * FROM LIKES WHERE id = ?", [likeId], (err, result) => {
        if(err)
        {
            console.log("Error: finding like");
            res.status(500).send('Internal Server Error');
            return;
        }

        if(!result[0])
        {
            res.status(404).send("Like not found");
            return;
        }
        if(result[0] && result[0].userId !== req.user.userId)
        {
            res.status(403).send("User can't delete other user likes");
            return;
        }
        else
        {
            connection.query("DELETE FROM LIKES WHERE id = ?", [likeId], (err) => {
                if(err)
                {
                    console.log("Error: deleting post comments", err);
                    res.status(500).send('Internal Server Error');
                }
                else
                {
                    res.status(200).send("Deleted like");
                }
            });
        }
    });
};

module.exports = { createLike, deleteLike };