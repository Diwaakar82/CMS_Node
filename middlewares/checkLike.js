const connection = require("../models/db.js");

const already_liked = (postId, userId) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM LIKES WHERE postId = ? AND userId = ?", [postId, userId], (err, result) => {
            if(err)
            {
                console.log("Error: getting like id");
                res.status(500).send('Internal Server Error');
                reject(err);
            }
            else
            {
                if(result.length)
                    resolve(true);
                else
                    resolve(false);
            }
        });
    });
};

module.exports = { already_liked };