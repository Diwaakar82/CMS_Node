const connection = require("../models/db.js");


const createDB = () => {
	connection.query("CREATE DATABASE CMS", (err) => {
        if(err)
            console.log("Error creating DB", err);
		else
			console.log("Created database succesfully");
    });

	connection.query("CREATE TABLE CATEGORIES (id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, title VARCHAR(50) NOT NULL UNIQUE)", (err) => {
        if(err)
            console.log("Error creating category table");
		else
			console.log("Created categories table succesfully");
    });

    connection.query("CREATE TABLE USERS (userId INT NOT NULL PRIMARY KEY AUTO_INCREMENT, username VARCHAR(20) NOT NULL, password_digest VARCHAR(100) NOT NULL, email VARCHAR(50) NOT NULL)", (err) => {
        if(err)
            console.log("Error creating user table");
		else
			console.log("Created users table succesfully");
    });

    connection.query("CREATE TABLE POSTS (ID BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT, TITLE VARCHAR(255) NOT NULL, DESCRIPTION TEXT NOT NULL, userId INT NOT NULL, FOREIGN KEY (userId) REFERENCES USERS(userId) ON DELETE CASCADE)", (err) => {
        if(err)
            console.log("Error creating POST table");
		else
			console.log("Created POSTS table succesfully");
    });

    connection.query("CREATE TABLE COMMENTS (id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT, commenter VARCHAR(255) NOT NULL, TEXT TEXT NOT NULL, post_id BIGINT NOT NULL, userId INT NOT NULL, FOREIGN KEY (post_id) REFERENCES POSTS(ID) ON DELETE CASCADE, FOREIGN KEY (userId) REFERENCES USERS(userId) ON DELETE CASCADE)", (err) => {
        if(err)
            console.log("Error creating comments table");
		else
			console.log("Created comments table succesfully");
    });

    connection.query("CREATE TABLE LIKES (id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT, postId BIGINT NOT NULL, userId INT NOT NULL, FOREIGN KEY (postId) REFERENCES POSTS(ID) ON DELETE CASCADE, FOREIGN KEY (userId) REFERENCES USERS(userId) ON DELETE CASCADE)", (err) => {
        if(err)
            console.log("Error creating LIKES table");
		else
			console.log("Created LIKES table succesfully");
    });

    

    connection.query("CREATE TABLE CATEGORIES_POSTS (category_id BIGINT NOT NULL, post_id BIGINT NOT NULL, FOREIGN KEY (category_id) REFERENCES CATEGORIES(id) ON DELETE CASCADE, FOREIGN KEY (post_id) REFERENCES POSTS(ID) ON DELETE CASCADE, PRIMARY KEY (category_id, post_id))", (err) => {
        if(err)
            console.log("Error creating join table");
		else
			console.log("Created join table succesfully");
    });
};

createDB();