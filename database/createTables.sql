-- Project
drop database if exists socialBlog;
create database socialBlog;
use socialBlog;
ALTER DATABASE socialBlog DEFAULT COLLATE utf8mb4_general_ci;

drop table if exists Users;
drop table if exists Posts;
drop table if exists Hashtag;
drop table if exists PostHashtag;
drop table if exists UserPostRead;
drop table if exists ReactionType;
drop table if exists PostReaction;
drop table if exists Comments;
drop table if exists `Following`;
drop table if exists HashtagFollowing;
drop table if exists `Groups`;
drop table if exists GroupMembers;
drop table if exists GroupPosts;

-- list of users
create table Users (
	user_id INT auto_increment, 
	username varchar(10) Not null Unique, 
    birthday DATETIME,
    primary key (user_id)
);

-- list of posts
create table Posts (
	post_id INT auto_increment, 
    author_id INT,
    private bool Default false,
    title varchar(50) Not null,
    content_body varchar(5000) ,
    created_at DATETIME,
    primary key (post_id),
    foreign key (author_id) references Users(user_id)
);

-- list of hashtags
create table Hashtag (
    hashtag_id INT auto_increment,
    `name` varchar(140),
    primary key (hashtag_id)
);

-- map hashtags associated with a post
create table PostHashtag (
	post_id INT,
    hashtag_id INT,
    primary key (post_id, hashtag_id),
    foreign key (post_id) references Posts(post_id),
    foreign key (hashtag_id) references Hashtag(hashtag_id)
);

-- map a user with a post that he/she had read
create table UserPostRead (
	user_id INT,
	post_id INT,
    primary key (user_id, post_id),
	foreign key (user_id) references Users(user_id),
	foreign key (post_id) references Posts(post_id)
);

-- List of reaction types
create table ReactionType (
    reaction_id INT auto_increment,
    reaction_type VARCHAR(30),
    primary key (reaction_id)
);

-- map a (user, post) with a thumbs response from that user
create table PostReaction (
	user_id INT,
	post_id INT, 
    reaction_id INT,
    created_at DATETIME,
    primary key (user_id, post_id),
    foreign key (user_id) references Users(user_id),
	foreign key (post_id) references Posts(post_id),
    foreign key (reaction_id) references ReactionType(reaction_id)
);

-- list of comments mapped to a post
create table Comments (
    comment_id INT auto_increment,
    post_id INT, 
    `comment` varchar(1000),
    created_at DATETIME,
    author_id INT,
    primary key (comment_id),
    foreign key (post_id) references Posts(post_id),
    foreign key (author_id) references Users(user_id)
);

-- maps users and other users that they follow
create table `Following` (
    user_id INT,
    follower_id INT,
    followed_at DATETIME,
    primary key (user_id, follower_id),
    foreign key (user_id) references Users(user_id),
    foreign key (follower_id) references Users(user_id)
);

-- maps users and hashtags that they follow
create table HashtagFollowing (
    user_id INT,
    hashtag_id INT,
    followed_at DATETIME,
    primary key (user_id, hashtag_id),
    foreign key (user_id) references Users(user_id),
    foreign key (hashtag_id) references Hashtag(hashtag_id)
);

-- list of groups and their properties
create table `Groups` (
    group_id INT auto_increment,
    admin_id INT,
    `name` varchar(50),
    memberSizeLimit INT,
    created_at DATETIME,
    primary key (group_id),
    foreign key (admin_id) references Users(user_id)
);

-- map a group and the user belonging to the group
create table GroupMembers (
    group_id INT,
    user_id INT,
    joined_at DATETIME,
    primary key (group_id, user_id),
    foreign key (group_id) references `Groups`(group_id),
    foreign key (user_id) references Users(user_id)
);

-- map a group and the posts belonging to the group
create table GroupPosts (
    group_id INT,
    post_id INT,
    primary key (group_id, post_id),
    foreign key (group_id) references `Groups`(group_id),
    foreign key (post_id) references Posts(post_id)
);

