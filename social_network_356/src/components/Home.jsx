import React, { useEffect, useState } from 'react';
import CreatePost from './CreatePost'
import PostDetails from './PostDetails'
import { Container, Row, Col } from 'react-bootstrap';
import CreateGroupModal from './CreateGroupModal';
import '../stylesheets/home.css';

const Home = (props) => {
    const [data, setData] = useState({ posts: [], followedUsers:[], followedGroups:[], followedHashtags:[] });

    useEffect(() => {
      refreshData();
    }, []);

    const refreshData = () =>{
      const abortController = new AbortController();
      const getData = async()=>{
        const posts = await getAllPosts(abortController);
        const followed = await getFollowed(abortController);
        setData({ ...data, posts, ...followed });
      }
      getData();
      return function cleanup(){
        abortController.abort()
      }
    }

    const getAllPosts = async (abortController) => {
        const signal = abortController?abortController.signal:undefined;
        try {
            const user_id = props.user.user_id;
            const response = await fetch(
                `/api/posts/${user_id}`, { method: 'GET', signal });
            const body = await response.json();
            if (response.status !== 200) {
                throw Error(body.message);
            }
            return body;
        } catch (error) {
            alert(error);
        }
    };

    const getFollowed = async (abortController) => {
      const signal = abortController.signal;
      const reqUser = { user_id:props.user.user_id, type:"user" };
      const reqHashtag = { user_id:props.user.user_id, type:"hashtag" };
      const reqGroup = { user_id:props.user.user_id, type:"group" };

      try {
        let response
        response = await fetch("/api/followed", 
          {   
              method: 'POST',
              headers: {'Content-Type':'application/json'},
              body: JSON.stringify(reqUser), 
              signal
          });
        let followedUsers = await response.json();
        response = await fetch("/api/followed", 
          {   
              method: 'POST',
              headers: {'Content-Type':'application/json'},
              body: JSON.stringify(reqHashtag), 
              signal
          });
        let followedHashtags = await response.json();
        response = await fetch("/api/followed", 
          {   
              method: 'POST',
              headers: {'Content-Type':'application/json'},
              body: JSON.stringify(reqGroup), 
              signal
          });
        let followedGroups = await response.json();
        return {followedGroups, followedHashtags, followedUsers};
      } catch (error) {
          alert(error);
      }
    };

    const listOfPosts = data.posts.map(function(post) {
        const { post_id, username, title, content_body, created_at, user_read } = post;
        const read = user_read ? "read" : "X";
        return (
          <PostDetails
              key={post_id}
              post={post}
              user_id={props.user.user_id}
          />
        );
    });

    return (
      <Row>
        <Col xs={9}>
          <div className="container">
          <CreatePost 
            user_id={props.user.user_id}
            refreshPostList={refreshData}
          />
          <h2>Post List</h2>
          <table className="table">
            <thead>
            <tr>
              <th>username</th>
              <th className="post-list-title">title</th>
              <th>created at</th>
              <th>read</th>
            </tr>
            </thead>
            <tbody>
              {listOfPosts}
            </tbody>
          </table>
          </div>
        </Col>
        <Col>
          <h1>Home</h1>
          <h2>
            Followed Groups:
          </h2>
          <CreateGroupModal userId={props.user.user_id}/>
          <ul>
            {data.followedGroups.map((item) => (
                <li key={item.id}>
                  <a href={`/group/${item.id}`}> {item.name} </a>
                </li>
            ))}
          </ul>
          <h2>
            Followed Users:
          </h2>
          <ul>
            {data.followedUsers.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
          <h2>
            Followed Hashtags:
          </h2>
          <ul>
            {data.followedHashtags.map((item) => (
                <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </Col>
      </Row>
    );
};

export default Home;
