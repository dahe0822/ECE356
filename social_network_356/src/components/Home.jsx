import React, { useEffect, useState } from 'react';

const Home = () => {
    const [data, setData] = useState({ posts: [] });

    useEffect(() => {
        const getAllPosts = async () => {
            try {
                const response = await fetch(`/api/posts`, { method: 'GET' });
                const body = await response.json();
                if (response.status !== 200) {
                    throw Error(body.message);
                }
                setData({ ...data, posts: body });
            } catch (error) {
                alert(error);
            }
        };
        getAllPosts();
    }, [data]);

    const listOfPosts = data.posts.map(function(post) {
        const { post_id, author_id, title, content_body, created_at } = post;
        return (
            <li>
                {' '}
                PostId {post_id}, AuthorId {author_id}, title {title},
                content_body {content_body}, created at {created_at}{' '}
            </li>
        );
    });

    return (
        <>
            <h1> List of Posts </h1>
            <ul>{listOfPosts}</ul>
        </>
    );
};

export default Home;
