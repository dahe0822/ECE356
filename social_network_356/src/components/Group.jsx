import React, { useEffect, useState } from 'react';
import CreatePost from './CreatePost'
import PostDetails from './PostDetails'
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import '../stylesheets/home.css';
import {
  useParams
} from "react-router-dom";

const Group = (props) => {
    const [data, setData] = useState({ posts: [], groupInfo:{} });
    const [newMember, setNewMember] = useState();
    const [memberToRemove, setMemberToRemove] = useState();
    const {id} = useParams();

    useEffect(() => {
      refreshData();
    }, []);

    const refreshData = () =>{
      const abortController = new AbortController();
      const getData = async()=>{
        const groupInfo = await getGroupInfo(abortController);
        const posts = await getAllPosts(abortController);
        setData({ ...data, posts, groupInfo });
        console.log(groupInfo);
      }
      getData();
      return function cleanup(){
        abortController.abort()
      }
    }

    const getGroupInfo = async (abortController) => {
        const signal = abortController?abortController.signal:undefined;
        try {
            const user_id = props.user.user_id;
            let response = await fetch(
                `/api/groupInfo/${id}`, { method: 'GET', signal });
            const body1 = await response.json();
            if (response.status !== 200) {
                throw Error(body1.message);
            }
            response = await fetch(
              `/api/memberOptions/${id}/${user_id}`, { method: 'GET', signal });
            const body2 = await response.json();
            if (response.status !== 200) {
                throw Error(body2.message);
            }
            return {...body1, newMemberOptions: body2};
        } catch (error) {
          if (!abortController.signal.aborted) {
            alert(error);
          }
        }
    };
    const getAllPosts = async (abortController) => {
        const signal = abortController?abortController.signal:undefined;
        try {
            const user_id = props.user.user_id;
            const response = await fetch(
                `/api/groupPosts/${id}/${user_id}`, { method: 'GET', signal });
            const body = await response.json();
            if (response.status !== 200) {
                throw Error(body.message);
            }
            return body;
        } catch (error) {
          if (!abortController.signal.aborted) {
            alert(error);
          }
        }
    };

    const addNewMember = async (e) => {
      e.preventDefault();
      if(newMember==null) return;
      const request = { group_id:id, user_id: data.groupInfo.newMemberOptions[newMember].id };
      try {
        const response = await fetch(
            "/api/groupMember", 
            {   
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(request)
            });
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message);
        }
        refreshData();
      } catch (error) {
          alert(error);
      }
    };

    const removeMember = async (e) => {
      e.preventDefault();
      if(memberToRemove==null) return;
      const request = { group_id:id, user_id: data.groupInfo.members.filter(item => item.user_id !== props.user.user_id)[memberToRemove].user_id };
      try {
        const response = await fetch(
            "/api/groupMember", 
            {   
                method: 'DELETE',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(request)
            });
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message);
        }
        refreshData();
      } catch (error) {
          alert(error);
      }
    };

    const listOfPosts = data.posts.map(function(post) {
        const { post_id, username, title, content_body, created_at, user_read } = post;
        const read = user_read ? "read" : "X";
        return (
            <>
               <PostDetails
                    post={post}
                    user_id={props.user.user_id}
               /> 
            </>
        );
    });

    const renderAdminControl = ()=>(
      <>
        <h2> Add Members: </h2>
        <span>Note: needs to be a user you follow</span>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Control value={newMember} onChange={(e)=>setNewMember(e.target.value)} as="select">
            <option disabled selected value> -- select an option -- </option>
            {data.groupInfo.newMemberOptions && data.groupInfo.newMemberOptions.map((memberOption,i)=>(
              <option key={memberOption.id} value={i}>{memberOption.name}</option>
            ))
          }
          </Form.Control>
          <Button onClick={addNewMember} variant="dark" size="sm">Add Member</Button>
        </Form.Group>

        <h2> Remove Members: </h2>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Control value={memberToRemove} onChange={(e)=>setMemberToRemove(e.target.value)} as="select">
            <option disabled selected value> -- select an option -- </option>
            {data.groupInfo.members && data.groupInfo.members.filter(item => item.user_id !== props.user.user_id).map((memberOption,i)=>(
              <option key={memberOption.user_id} value={i}>{memberOption.username}</option>
            ))
          }
          </Form.Control>
          <Button onClick={removeMember} variant="dark" size="sm">Remove Member</Button>
        </Form.Group>
      </>
    )

    return (
      <Row>
        <Col xs={9}>
          <div className="container">
            <CreatePost 
              group={id}
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
          <h1>{data.groupInfo && data.groupInfo.name}</h1>
          <h2>Info</h2>
          <ul>
            <li><b>Status:</b> {props.user.user_id === data.groupInfo.admin_id? "Admin": "Member"} </li>
            <li><b>Created at:</b> {data.groupInfo.created_at} </li>
            <li><b>Member Size Limit:</b> {data.groupInfo.memberSizeLimit} </li>
          </ul>
          <h2>Members</h2>
          <ul>
            {data.groupInfo.members && data.groupInfo.members.map((item) => (
              <li key={item.user_id}>{item.username}</li>
            ))}
          </ul>
          {props.user.user_id === data.groupInfo.admin_id && renderAdminControl()}
        </Col>
      </Row>
    );
};

export default Group;
