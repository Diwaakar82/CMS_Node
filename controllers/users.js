const connection = require("../models/db.js");
const bcrypt = require("bcrypt");
const { genAccessToken } = require("../middlewares/generateAccessToken.js")

//@desc Create user
//@route POST /users/signin
// @access public
const signin = async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    connection.query("SELECT * FROM USERS WHERE email = ?", [email], (err, result) => {
        if(err)
        {
            console.log("Error: getting user");
            res.status(500).send('Internal Server Error');
        }

        if(result.length)
        {
            console.log("User already exists");
            res.status(409).send("User already exists");
        }
        else
        {
            connection.query("INSERT INTO USERS (username, password_digest, email) VALUES (?, ?, ?)", [username, hashedPassword, email], (err, result) => {
                if(err)
                {
                    console.log("Error: inserting user" + err);
                    res.status(500).send('Internal Server Error');
                }

                res.status(201).json(result);
            });
        }
    });
};

//@desc Login user
//@route POST /users/login
// @access public
const login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    connection.query("SELECT * FROM USERS WHERE email = ?", [email], async (err, result) => {
        if(err)
        {
            console.log("Error: loging user");
            res.status(500).send('Internal Server Error');
        }
        if(!result.length)
        {
            console.log("User doesn't exist");
            res.status(404).send("User doesn't exist");
        }
        else
        {
            const hashedPassword = result[0].password_digest;

            if(await bcrypt.compare(password, hashedPassword))
            {
                const token = genAccessToken(email, result[0].userId);
                res.json({accessToken: token});
            }
            else
            {
                res.status(403).send("Incorrect email or password");
            }
        }
    });
};

//@desc Find current user
//@route GET /users/current
// @access private
const current_user = (req, res) => {
    const email = req.body.email;
    
    connection.query("SELECT * FROM USERS WHERE email = ?", [email], async(err, result) => {
        if(err)
        {
            console.log("Error: getting user id");
            res.status(500).send('Internal Server Error');
        }

        res.json(result);
    });
};

//@desc Update current user
//@route PUT/PATCH /users/current
// @access private
const update_user = (req, res) => {

};

module.exports = { signin, login, current_user, update_user };