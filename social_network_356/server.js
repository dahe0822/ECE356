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

//View list of posts for specific user
app.get('/api/posts/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    // const sql_query = "SELECT post_id, username, title, created_at, private FROM Posts INNER JOIN Users ON Posts.author_id = Users.user_id";
    const sql_query = `SELECT Posts.post_id, Users.username, Posts.title, Posts.content_body, Posts.created_at, Posts.private, true AS user_read
    FROM  Posts INNER JOIN
             Users ON Posts.author_id = Users.user_id LEFT OUTER JOIN
             UserPostRead ON UserPostRead.user_id = ${user_id} AND Posts.post_id = UserPostRead.post_id
    WHERE (UserPostRead.post_id IS NOT NULL)
    UNION
    SELECT Posts_1.post_id, Users_1.username, Posts_1.title, Posts_1.content_body, Posts_1.created_at, Posts_1.private, false AS user_read
    FROM  Posts Posts_1 INNER JOIN
             Users Users_1 ON Posts_1.author_id = Users_1.user_id LEFT OUTER JOIN
             UserPostRead UserPostRead_1 ON UserPostRead_1.user_id = ${user_id} AND Posts_1.post_id = UserPostRead_1.post_id
    WHERE (UserPostRead_1.post_id IS NULL)`;
    pool.query(sql_query, function(err, result, fields) {
        if (err) throw new Error(err);
        res.send(result);
    });
});

//View one post
app.get('/api/post/:postId', (req, res) => {
    pool.query(
        'SELECT post_id, title, content_body, created_at, author_id, private FROM `Posts` WHERE post_id = ? ',
        [req.params.postId],
        function(err, result, fields) {
            if (err) throw new Error(err);
            res.send(result);
        }
    );
});

//View comments on a post
app.get('/api/comments/:postId', (req, res) => {
    pool.query(
        `SELECT comment_id, post_id, comment, created_at, username as author_name FROM Comments INNER JOIN Users ON Users.user_id = Comments.author_id WHERE post_id = ?`,
        [req.params.postId],
        function(err, result, fields) {
            if (err) throw new Error(err);
            res.send(result);
        }
    );
});

// Insert a comment
app.post('/api/comment', (req, res) => {
    const {author_id, comment, post_id } = req.body;    
    const created_at = new Date();
    const sql_query = 'INSERT INTO Comments SET ?';
    // console.log(sql_query);
    pool.query(
        sql_query,
        { author_id, comment, post_id, created_at },
        function(err, result, fields) {
            if (err) throw new Error(err);
            res.send(result);
        }
    );
});

// mark a post as read by user
app.post('/api/read', (req, res) => {
    const { user_id, post_id } = req.body;    
    const sql_query = 'INSERT INTO UserPostRead SET ?';
    pool.query(
        sql_query,
        { user_id, post_id },
        function(err, result) {
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

//Search results of user and return following information (not from current user)
app.get('/api/search/:username', (req, res) => {
    
    let currUser = req.params.username;
    const user = req.query.user;
    const hashtag = req.query.hashtag;
    const group = req.query.group;

    let query = "";
    let searchFor = "";
    if(user){
      let raw = "SELECT SearchedUser.id, SearchedUser.name, (followedId IS NOT NULL) isFollowing FROM \
        (SELECT user_id as id,username as name FROM Users WHERE instr(username, ?) AND user_id<>?) as SearchedUser LEFT JOIN \
        (SELECT follower_id as followedId from Following where user_id=?) as Followed ON followedId=id;"
      query= mysql.format(raw, [user, currUser, currUser]);
    } else if(hashtag){
      let raw = "SELECT id, name, (followedId IS NOT NULL) isFollowing FROM \
	      (SELECT hashtag_id as id, name FROM Hashtag WHERE instr(name, ?)) as Searched LEFT JOIN \
        (SELECT hashtag_id as followedId from HashtagFollowing where user_id=?) as Followed ON followedId=id;"
      query= mysql.format(raw, [hashtag, currUser]);
      searchFor = user;
    } else if(group){
      let raw = "SELECT id, name, (followedId IS NOT NULL) isFollowing FROM \
	      (SELECT group_id as id, name FROM Groups WHERE instr(name, ?)) as Searched LEFT JOIN \
        (SELECT group_id as followedId from GroupMembers where user_id=?) as Followed ON followedId=id;"
      query= mysql.format(raw, [group, currUser]);
      searchFor = user;
    } else{
      return res.send([]);
    }
    console.log(query);
    pool.query(
        query,
        function(err, result, fields) {
            if (err) throw new Error(err);
            res.send(result);
        }
    );
});

// Unfollow: (hashtag, group, user)
app.post('/api/unfollow/:type', (req, res) => {
    const { user_id, followId } = req.body;
    let type = req.params.type; // user | group | hashtag

    let raw = "";
    if(type == "user"){
      raw = "DELETE FROM Following WHERE user_id=? and follower_id=?;"
    } else if(type == "hashtag"){
      raw = "DELETE FROM HashtagFollowing WHERE user_id=? and hashtag_id=?;"
    } else if(type = "group"){
      raw = "DELETE FROM GroupMembers WHERE user_id=? and group_id=?;"
    } else{
      return res.send(null);
    }
    console.log(raw);
    console.log("UESEERRRRID ", user_id);
    pool.query(
      raw,
      [user_id, followId],
      function(err, result, fields) {
          if (err) throw new Error(err);
          res.send(result);
      }
    );
});

// Follow: (hashtag, group, user)
app.post('/api/follow/:type', (req, res) => {
    const { user_id, followId } = req.body;
    let type = req.params.type; // user | group | hashtag
    
    const created_at = new Date();
    let raw = "";
    if(type == "user"){
      raw = "INSERT INTO Following SET user_id=?, follower_id=?, followed_at=?;"
    } else if(type == "hashtag"){
      raw = "INSERT INTO HashtagFollowing SET user_id=?, hashtag_id=?, followed_at=?;"
    } else if(type = "group"){
      raw = "INSERT INTO GroupMembers SET user_id=?, group_id=?, joined_at=?;"
    } else{
      return res.send(null);
    }
    console.log(raw);
    pool.query(
      raw,
      [user_id, followId, created_at],
      function(err, result, fields) {
          if (err) throw new Error(err);
          res.send(result);
      }
    );
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
app.post('/api/create_post', (req, res) => {
    const { author_id, title, content_body, hashtags } = req.body;
    
    const created_at = new Date();
    
    var union_sql = '';
    var UNION = 'UNION ';
    for (let i = 0; i < hashtags.length; i++) {
        union_sql += `SELECT '${hashtags[i]}' as name ${UNION}`;
    };
    union_sql = union_sql.substring(0, union_sql.length - UNION.length-1);
    var insert_post_sql = `INSERT INTO Posts SET ?`;
    var insert_hashtag_sql = hashtags.length === 0 ? '' : `INSERT INTO Hashtag (name) SELECT name from (${union_sql}) as User_Hashtags where not exists (select name from Hashtag WHERE User_Hashtags.name = Hashtag.name);`
    var pair_post_and_hashtag = hashtags.length === 0 ? '' :`INSERT INTO PostHashtag (post_id, hashtag_id) SELECT post_id, hashtag_id from (${union_sql}) as t1 inner join Hashtag using(name) CROSS JOIN (SELECT MAX(post_id) as post_id from Posts) as t2;`;
    var sql = `${insert_post_sql}; ${insert_hashtag_sql} ${pair_post_and_hashtag}`;
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

