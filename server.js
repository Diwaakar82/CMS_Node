const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/users", require("./routes/users.js"))
app.use("/posts", require("./routes/posts.js"));
app.use("/categories", require("./routes/categories.js"));
app.use("/posts", require("./routes/likes.js"));

app.listen(port, () => {
    console.log(`Server running at ${port}`);
});