import React, {useContext, useEffect, useState} from 'react';
import './PostModal.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookmark, faMultiply, faThumbsDown, faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import calculateTimeAgo from "../../Constants/calculateTimeAgo.js";

const PostModal = ({post, onClose, handleReaction, username, profilePicture}) => {

    const [comments, setComments] = useState(post.comments || []);
    const [newComment, setNewComment] = useState('');

    const [expandCaption, setExpandCaption] = useState(false);

    const captionExceedsLimit = post.caption.length > 100;

    const handleSubmitComment = (e) => {
        e.preventDefault();
        setComments([...comments, newComment]);
        setNewComment('');
    };

    return (
        <div className="post-modal">
            <div className="post-modal-content">
                <span className="close" onClick={() => onClose(null)}><FontAwesomeIcon icon={faMultiply}/></span>
                <div className="post-modal-image">
                    <img src={post.img} alt="Post"/>
                </div>
                <div className="post-details">
                    <div className="post-uploader">
                        <img src={profilePicture} alt="Profile"/>
                        <p>{username}</p>
                    </div>
                    <p className={`post-modal-caption ${expandCaption ? 'expanded' : ''}`} style={{
                        maxHeight: expandCaption ? 'none' : '100px'
                    }}>{post.caption}{captionExceedsLimit && !expandCaption && (
                        <button className="read-more" onClick={() => setExpandCaption(true)}> More</button>
                    )}
                        {expandCaption && (
                            <button className="read-more" onClick={() => setExpandCaption(false)}> Less</button>
                        )}</p>
                    <div className="comments">
                        {comments.length === 0 ? <p className="no-comments">No comments yet</p> :
                            comments.map((comment, index) => (
                                <p key={index}>{comment}</p>
                            ))}
                    </div>
                    <form onSubmit={handleSubmitComment}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                        />
                        <button type="submit">Post</button>
                    </form>
                    <div className="post-reactions">
                        <button className={post.likes.includes(username) ? "active-action " : ""}
                                onClick={() => handleReaction("like")}><FontAwesomeIcon
                            icon={faThumbsUp}/>
                            <span>{post.likes.length}</span></button>
                        <button className={post.dislikes.includes(username) ? "active-action " : ""}
                                onClick={() => handleReaction("dislike")}><FontAwesomeIcon
                            icon={faThumbsDown}/>
                            <span>{post.dislikes.length}</span>
                        </button>
                        <button className={"save-post"}><FontAwesomeIcon icon={faBookmark}/></button>
                        <div className="upload-time">{calculateTimeAgo(new Date(post.date))}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostModal;