const mysql = require('mysql');
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

//------------------------------------------------------------------------------
//MySQL Setup Connection
//------------------------------------------------------------------------------
var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.REACT_APP_HOST,
    user: process.env.REACT_APP_USER,
    password: process.env.REACT_APP_PASSWORD,
    database: process.env.REACT_APP_DBNAME,
    insecureAuth: true
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
        throw new Error(err);
    }
    if (connection) connection.release();
    return;
});

//------------------------------------------------------------------------------
//Beginning of API endpoints
//------------------------------------------------------------------------------

//Create User
app.post('/api/users', (req, res) => {
    const { username } = req.body;
    const birthday = new Date();

    let query = pool.query(
        'INSERT INTO `Users` SET ?',
        { username, birthday },
        function(err, result, fields) {
            if (err) throw new Error(err);
            res.send(result);
        }
    );
});

//Get User by username
app.get('/api/users/:username', (req, res) => {
    pool.query(
        'SELECT * FROM `Users` WHERE username = ? ',
        [req.params.username],
        function(err, result, fields) {
            if (err) throw new Error(err);
            res.send(result);
        }
    );
});

//Create public posts
app.post('/api/posts', (req, res) => {
    const { author_id, title, content_body } = req.body;
    const created_at = new Date();
    pool.query(
        'INSERT INTO `Posts` SET ?',
        { author_id, title, content_body, created_at },
        function(err, result, fields) {
            if (err) throw new Error(err);
            res.send(result);
        }
    );
});

//View list of posts
app.get('/api/posts', (req, res) => {
    const sql_query = "SELECT post_id, username, title, created_at, private FROM Posts INNER JOIN Users ON Posts.author_id = Users.user_id";
    pool.query(sql_query, function(err, result, fields) {
        if (err) throw new Error(err);
        res.send(result);
    });
});

//View one post
app.get('/api/posts/:postId', (req, res) => {
    pool.query(
        'SELECT * FROM `Posts` WHERE post_id = ? ',
        [req.params.postId],
        function(err, result, fields) {
            if (err) throw new Error(err);
            res.send(result);
        }
    );
});
