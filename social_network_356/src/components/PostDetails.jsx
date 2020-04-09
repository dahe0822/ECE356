import React, { useEffect, useState } from 'react';
import { Collapse, Button } from 'react-bootstrap';
import '../stylesheets/postDetails.css';
import ThumbsUp from '../img/thumbs-up.png';
import ThumbsDown from '../img/thumbs-down.png';

const PostDetails = (props) => {
    const [comments, setComments] = useState([]);
    const [hashtags, setHashtags] = useState([]);
    const [open, setOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [userRead, setUserRead] = useState(props.post.user_read);
    const [numOfThumbsUp, setNumOfThumbsUp] = useState(0);
    const [numOfThumbsDown, setNumOfThumbsDown] = useState(0);

    const THUMBSUP_TYPE = "thumbs-up";
    const THUMBSDOWN_TYPE = "thumbs-down";

    useEffect(() => {
        getComments();
        getHashtags();
        getReaction();
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

    const getHashtags = async () => {
        try {
            const post_id = props.post.post_id;
            const response = await fetch(
                `/api/hashtags/${post_id}`, { method: 'GET' });
            const body = await response.json();
            if (response.status !== 200) {
                throw Error(body.message);
            }
            setHashtags(body);
        } catch (error) {
            alert(error);
        }
    };

    const getReaction = async () => {
        try {
            const post_id = props.post.post_id;
            const response = await fetch(
                `/api/post/reaction/${post_id}`, { method: 'GET' });
            const body = await response.json();
            if (response.status !== 200) {
                throw Error(body.message);
            }
            setNumOfThumbsUp(body[0].thumbsupcount);
            setNumOfThumbsDown(body[0].thumbsdowncount);
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

    const updateReaction = async (reactionType) => {
        const url ='/api/post/reaction';
            const data = { user_id: props.user_id, post_id: props.post.post_id, reaction_type: reactionType };
    
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
                getReaction();
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

    const listOfHashtags = hashtags.map(function(hashtag) {
        return (
            <>
               <div className="hashtag" key={hashtag.name}>{"#"}{hashtag.name}</div>
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
    };

    const onReactionClick = (reactionType) => {
        updateReaction(reactionType);
        getReaction();
    };

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
                <div className="hashtags">{listOfHashtags}</div>
                <div className="wrapper">
                    <div className="thumbs-container">
                        <img src={ThumbsUp} alt='thumbs-up' onClick={()=>onReactionClick(THUMBSUP_TYPE)} />
                        <span>{numOfThumbsUp}</span>
                        <span> | </span>
                        <span>{numOfThumbsDown}</span>
                        <img src={ThumbsDown} alt='thumbs-down' onClick={()=>onReactionClick(THUMBSDOWN_TYPE)} />
                    </div>
                </div>
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
