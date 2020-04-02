import React, { useEffect, useState } from 'react';
import { Collapse, Button } from 'react-bootstrap';
import '../stylesheets/postDetails.css';

const PostDetails = (props) => {
    const [comments, setComments] = useState([]);
    const [open, setOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [userRead, setUserRead] = useState(props.post.user_read);

    useEffect(() => {
        getComments();
    }, []);

    const getComments = async () => {
        try {
            const post_id = props.post.post_id;
            const response = await fetch(
                `/api/comments/${post_id}`, { method: 'GET' });
            const body = await response.json();
            if (response.status !== 200) {
                throw Error(body.message);
            }
            setComments(body);
        } catch (error) {
            alert(error);
        }
    };

    const updateReadStatus = async () => {
        const url ='/api/read';
            const data = { user_id: props.user_id, post_id: props.post.post_id };
    
            try {
                const response = await fetch(
                    url, 
                    {   
                        method: 'POST',
                        headers: {'Content-Type':'application/json'},
                        body: JSON.stringify(data)
                    });
                const body = await response.json();
                if (response.status !== 200) {
                    throw Error(body.message);
                }
                setUserRead(1);
            } catch (error) {
                alert(error);
            }
    };

    const postComment = async() => {
        const url ='/api/comment';
            const data = { author_id: props.user_id, comment: comment, post_id: props.post.post_id };
    
            try {
                const response = await fetch(
                    url, 
                    {   
                        method: 'POST',
                        headers: {'Content-Type':'application/json'},
                        body: JSON.stringify(data)
                    });
                const body = await response.json();
                if (response.status !== 200) {
                    throw Error(body.message);
                }
                getComments();
            } catch (error) {
                alert(error);
            }
    }

    const listOfComments = comments.map(function(cmt) {
        const { comment_id, comment, created_at, author_name } = cmt;
        return (
            <>
               <div className="comment-list-item" key={comment_id}><b>{author_name}{' - '}</b>{comment} <span className="create-date">{created_at}</span></div>
            </>
        );
    });

    
    const addComment = event => {
        event.preventDefault();
        if(comment!==''){
            postComment();
            setComment('');
        } 
    };
    
    const onPostClick = () => {
        setOpen(!open);
        if (!userRead) {
            updateReadStatus();
        }
    }

    const { post_id, username, title, content_body, created_at } = props.post;
    // const read = readStatus ? "read" : "X";

    return (
        <>
        <tr key={ post_id }
        onClick={ () => onPostClick()}>
                <td>{ username } </td>
                <td className="post-list-title">{ title } </td>
                <td>{ created_at } </td>                
                <td>{ userRead?'read':'X' } </td>                
        </tr>
        
        <tr>
        <Collapse in={open}>
        <td colspan="4" className="">
            <div className="post-details-container">
                <div className="content-body">{content_body}</div>
                
                <div className="comments-header">Comments</div>
                <div className="comments-container">
                    <div>{listOfComments}</div>
                    <div>
                        <b>{props.post.username} </b>
                        <textarea 
                        // id="post-content" 
                        className="input-field comment" 
                        value={comment} 
                        onChange={(e) => {
                            setComment(e.target.value);
                        }} 
                        name="post-content" />
                <Button onClick={addComment} variant="dark" size="sm">Add</Button>
                </div>
                </div>
            </div>
        </td>

        </Collapse>
        </tr>
        </>
    );
};

export default PostDetails;
