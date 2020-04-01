import React, { useEffect, useState } from 'react';
import CreatePost from './CreatePost'
import '../stylesheets/home.css';

const Home = (props) => {
    const [data, setData] = useState({ posts: [] });

    useEffect(() => {
        getAllPosts();
    }, []);

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

    const listOfPosts = data.posts.map(function(post) {
        const { post_id, username, title, created_at } = post;
        return (
            <tr key={ post_id }>
                <td>{ username } </td>
                <td className="post-list-title">{ title } </td>
                <td>{ created_at } </td>                
            </tr>
        );
    });

    return (
        <>
            <div className="container">
            <CreatePost 
                user_id={props.user.user_id}
                refreshPostList={getAllPosts}
            />
            <h2>Post List</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>username</th>
                    <th className="post-list-title">title</th>
                    <th>created at</th>
                </tr>
                </thead>
                <tbody>
                    {listOfPosts}
                </tbody>
            </table>
            </div>
        </>
    );
};

export default Home;
