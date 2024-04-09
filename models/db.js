const mysql = require("mysql2");
const dotenv = require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  insecureAuth: true
});

connection.connect(error => {
    if (error) 
    {
        console.log(process.env.MYSQL_USER);
        throw error;
    }
    console.log("Successfully connected to the database.");
});



module.exports = connection;