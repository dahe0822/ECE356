import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import '../stylesheets/post.css';

const CreatePost = (props) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [hashtag, setHashtag] = useState('');
    const [addedHashtags, setAddedHashtags] = useState([]);
    const [hashtagValidationMsg, setHashtagValidationMsg] = useState('');
    const [postValidationMsg, setPostValidationMsg] = useState('');

    const HASHTAG_EXIST_MSG = "Already added!";
    const TITLE_EMPTY_MSG = "Enter the title!";
    const CONTENT_EMPTY_MSG = "Enter the content!";
   
    const insertPostAndHashtag = async() => {
        const url ='/api/posthashtag';
            const data = { author_id: props.user_id, title: title, content_body: body, hashtags: addedHashtags };
    
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
            } catch (error) {
                alert(error);
            }
    }

    const handlePost = (event) => {
        event.preventDefault();
        
        if(title === ''){
            setPostValidationMsg(TITLE_EMPTY_MSG);
        }else if(body ===''){
            setPostValidationMsg(CONTENT_EMPTY_MSG);
        }else{
            setPostValidationMsg('')
            setHashtagValidationMsg('')

            insertPostAndHashtag();
            setTitle('');
            setBody('');
            setAddedHashtags([]);
        }
    };

    const addHashtag = event => {
        event.preventDefault();
        if(isHashtagAlreadyAdded(hashtag)){
            setHashtagValidationMsg(HASHTAG_EXIST_MSG)
        }else if(hashtag!==''){
            setHashtagValidationMsg('')

            let newHashtag = hashtag;
            setAddedHashtags([...addedHashtags, newHashtag]);
            setHashtag('');
        } 
    };
    
    const listOfHashtags = addedHashtags.map(function(hashtag) {
        return (
            <div className="hashtag-added-item" key={hashtag} value={hashtag}>
                #{hashtag} 
                <span>
                    <button className="x-button" value={hashtag} onClick={(e) => {
                        removeHashtag(e.target.value);
                    }} >
                    x            
                    </button>             
                </span>  
            </div>
        );
    });

    const isHashtagAlreadyAdded = (hashtag) => {
        return addedHashtags.some(item => item === hashtag);
    };

    const removeHashtag = (hashtag) => {
        const newHashtags = addedHashtags.filter(item => item !== hashtag);
        setAddedHashtags(newHashtags);
        console.log(hashtag);
    };

    return (
        <>
        <div className="wrapper">
        <div className="conatiner post-creation-container">
            <form onSubmit={handlePost}>
            <h2>create post</h2>
            <input 
                id="post-title" 
                className="post-title-input-field" 
                value={title} 
                onChange={(e) => {
                    setTitle(e.target.value);
                }} 
                name="post-title" 
                type="text" 
                placeholder="Title" />
            <textarea 
                id="post-content" 
                className="post-content-input-field" 
                value={body} 
                onChange={(e) => {
                    setBody(e.target.value);
                }} 
                name="post-content" />
            <div className="hashtag-list">{listOfHashtags}</div>
            <input 
                className="hashtag-input-field" 
                name="post-hashtag" 
                type="text" 
                placeholder="hashtag"
                value={hashtag}
                onChange={(e) => {
                    setHashtag(e.target.value);
                }} 
            />
            
            <Button onClick={addHashtag} variant="dark" size="sm">Add</Button>{' '}
            <div className="error-msg" type="hashtag">{hashtagValidationMsg}</div>
            <div className="post-button-wrapper">
                <div className="error-msg" type="post">{postValidationMsg}</div>
                <Button type="submit" variant="dark" className="post-button">Post</Button>{' '}
            </div>
            </form>
        </div>
        </div>
        </>
    );
};

export default CreatePost;
