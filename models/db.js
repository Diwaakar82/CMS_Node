const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  insecureAuth: true
});

connection.connect(error => {
    if (error) 
        throw error;
    console.log("Successfully connected to the database.");
});

// const createDB => ({
// 	connection.query("CREATE DATABASE CMS", (err, results) => {
//         if(err)
//             console.log("Error");
// 		else
// 			console.log("Created database succesfully");
//     });

// 	connection.query("CREATE TABLE id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), description TEXT,", (err, results) => {
//         if(err)
//             console.log("Error");
// 		else
// 			console.log("Created database succesfully");
//     });
// });

module.exports = connection;