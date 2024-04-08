const jwt = require("jsonwebtoken");

const genAccessToken = (email, userId) => {
    const payload = {email: email, userId: userId};
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
}

const validateToken = (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;

    if(authHeader && authHeader.startsWith("Bearer"))
    {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err)
            {
                res.status(401).send("User not authorized");
                return;
            }

            req.user = decoded;
            next();
        });

        if(!token)
        {
            res.status(401).send("User not authorized or token is missing");
        }
    }
    else
    {
        res.status(401).send("User not authorized or token missing");
    }
}

module.exports = { genAccessToken, validateToken };