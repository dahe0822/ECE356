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
    insecureAuth: true,
    multipleStatements: true
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

app.get('/api/hashtag', (req, res) => {
    const { name } = req.body;
    const sql_query = `SELECT hashtag_id FROM Hashtag WHERE name='${name}';`;
    pool.query(sql_query, function(err, result, fields) {
        if (err) throw new Error(err);
        res.send(result);
        console.log(result);
    });
});

//Insert hashtag if not exist
app.post('/api/hashtag', (req, res) => {
    const { hashtags } = req.body;
    var union_sql = '';
    var UNION = 'UNION ';
    for (let i = 0; i < hashtags.length; i++) {
        union_sql += `SELECT '${hashtags[i]}' as name ${UNION}`;
    };
    union_sql = union_sql.substring(0, union_sql.length - UNION.length-1);
    var sql = `INSERT INTO Hashtag (name) SELECT name from (${union_sql}) as User_Hashtags where not exists (select name from Hashtag WHERE User_Hashtags.name = Hashtag.name)`
    console.log(sql);
    pool.query(
        sql,
        function(err, result) {
            if (err) throw new Error(err);
            res.send(result);
        }
    );
});

// Create a post and new hashtags then pair them in PostHashtag table
app.post('/api/post', (req, res) => {
    const { author_id, title, content_body, hashtags } = req.body;
    
    const created_at = new Date();
    
    var union_sql = '';
    var UNION = 'UNION ';
    for (let i = 0; i < hashtags.length; i++) {
        union_sql += `SELECT '${hashtags[i]}' as name ${UNION}`;
    };
    union_sql = union_sql.substring(0, union_sql.length - UNION.length-1);
    var insert_hashtag_sql = `INSERT INTO Hashtag (name) SELECT name from (${union_sql}) as User_Hashtags where not exists (select name from Hashtag WHERE User_Hashtags.name = Hashtag.name)`
    var insert_post_sql = `INSERT INTO Posts SET ?`;
    var pair_post_and_hashtag = `INSERT INTO PostHashtag (post_id, hashtag_id) SELECT post_id, hashtag_id from (${union_sql}) as t1 inner join Hashtag using(name) CROSS JOIN (SELECT MAX(post_id) as post_id from Posts) as t2`;
    var sql = `${insert_post_sql}; ${insert_hashtag_sql}; ${pair_post_and_hashtag};`;
    console.log(sql);
    pool.query(
        sql,
        { author_id, title, content_body, created_at },
        function(err, result, fields) {
            if (err) throw new Error(err);
            res.send(result);
        }
    );
});

