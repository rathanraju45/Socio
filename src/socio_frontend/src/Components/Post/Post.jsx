import React, {useRef, useContext, useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faHeart,
    faComment,
    faShare,
    faUserPlus,
    faBookmark,
    faVolumeMute,
    faVolumeUp,
    faPlayCircle
} from '@fortawesome/free-solid-svg-icons';
import './Post.css';
import {GlobalStore} from "../../store/GlobalStore.jsx";

// eslint-disable-next-line react/prop-types
export default function Post({post}) {

    const {darkMode,deviceType} = useContext(GlobalStore);
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState(0);
    const [showFullCaption, setShowFullCaption] = useState(false);

    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const [isPlaying, setIsPlaying] = useState(false);

    const dummyCommentsList = Array.from({length: 20}, (_, i) => ({
        username: `user${i + 1}`,
        profilePic: `https://randomuser.me/api/portraits/men/${i + 1}.jpg`,
        comment: `This is a comment from user${i + 1}.`
    }));

    const [showComments, setShowComments] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const [commentsList, setCommentsList] = useState(dummyCommentsList.map(comment => comment.comment));

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const addComment = (event) => {
        event.preventDefault();
        setCommentsList([...commentsList, commentInput]);
        setCommentInput('');
    };

    const toggleLike = () => {
        setLikes(isLiked ? likes - 1 : likes + 1);
        setIsLiked(!isLiked);
    };

    const toggleCaption = () => {
        setShowFullCaption(!showFullCaption);
    };

    // eslint-disable-next-line react/prop-types
    const caption = showFullCaption ? post.caption : `${post.caption.substring(0, 100)}...`;

    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    videoRef.current.play();
                    setIsPlaying(true);
                } else {
                    videoRef.current.pause();
                    setIsPlaying(false);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    const togglePlayPause = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    return (
        <div className="post" style={{
            boxShadow: deviceType === 'mobile' ? darkMode ? "0 0 10px rgba(255,255,255,0.3)" : "0 0 10px rgba(0,0,0,0.3)" : darkMode ? "0 0 10px rgba(255,255,255,0.7)" : "0 0 10px rgba(0,0,0,0.7)",
        }}>
            <div className="post-header">
                <img src={post.profilePic} alt="profile" className="profile-pic"/>
                <h3 className="username">{post.username}</h3>
                <button className="follow-button"><FontAwesomeIcon icon={faUserPlus}/> Follow</button>
            </div>
            {post.mediaType === 'image' ? (
                <img src={post.media} alt="post"/>
            ) : (
                <div className={"video-container"}>
                    <video ref={videoRef} loop muted={isMuted} onClick={() => togglePlayPause()}>
                        <source src={post.media} type="video/mp4"/>
                        Your browser does not support the video tag.
                    </video>
                    {!isPlaying && <FontAwesomeIcon icon={faPlayCircle} className="pause-icon"/>}
                    <button className={"volume-button"} onClick={() => setIsMuted(!isMuted)}>
                        <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp}/>
                    </button>
                </div>
            )}
            <div className="caption">
                <span className="username-caption">{post.username}</span>&nbsp;
                <span className="caption-text">{caption}</span>
                {post.caption.length > 100 && <button className={"see-more"}
                                                      onClick={toggleCaption}>{showFullCaption ? 'See Less' : 'See More'}</button>}
            </div>
            <div className="post-actions">
                <button className={isLiked ? "liked" : ""} onClick={() => {
                    toggleLike();
                }
                }><FontAwesomeIcon icon={faHeart}/> {likes}</button>
                <button onClick={() => toggleComments()}><FontAwesomeIcon icon={faComment}/> {comments}
                </button>
                <button><FontAwesomeIcon icon={faShare}/></button>
                <button className={`save-icon + ${isSaved ? "saved" : ""}`} onClick={() => setIsSaved(!isSaved)}>
                    <FontAwesomeIcon icon={faBookmark}/></button>
            </div>

            {showComments && (
                <div className="comments-section">
                    <form onSubmit={addComment}>
                        <input type="text" value={commentInput} onChange={(e) => setCommentInput(e.target.value)}
                               placeholder="Add a comment..."/>
                        <button type="submit">Post</button>
                    </form>
                    <div className="comments-list">
                        {commentsList.map((comment, index) => (
                            <div key={index} className="comment">
                                <img src={dummyCommentsList[index].profilePic} alt="profile"/>
                                <span className="username-comment">{dummyCommentsList[index].username}</span>
                                <span className="comment-text">{comment}</span>
                            </div>
                        ))}

                    </div>
                </div>
            )}
        </div>
    );
}