const express = require("express");
const dotenv = require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/posts", require("./routes/posts.js"));
app.use("/categories", require("./routes/categories.js"));
// app.use("/posts", require("./controllers/posts.js"));

app.listen(port, () => {
    console.log(`Server running at ${port}`);
});