// eslint-disable-next-line no-unused-vars
import React, {useContext, useEffect, useState} from "react";
import './Profile.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookmark, faFilm, faImage, faPlus, faTag} from "@fortawesome/free-solid-svg-icons";

import {GlobalStore} from "../../store/GlobalStore.jsx";
import useConvertToImage from "../../hooks/useConvertToImage.js";
import Loader from "../Loaders/Loader.jsx";
import useConvertPostsImages from "../../hooks/useConvertPostsImages.jsx";
import {useNavigate, useParams} from "react-router-dom";

import chatIdGenerator from '../../Constants/chatIdGenerator.js';

export default function Profile({typeOfProfile,setSelectedChat}) {

    const navigate = useNavigate();

    const {username: profileUser} = useParams();

    const {setAlert, deviceType, actor, userDetails, setUserDetails} = useContext(GlobalStore);
    const {image, convertToImage} = useConvertToImage();
    const {updatedPosts, conversionOfBlobs} = useConvertPostsImages();

    const [activeTab, setActiveTab] = useState("Posts");/* Mobile styles */
    const [profile, setProfile] = useState(null);
    const [postAddresses, setPostAddresses] = useState([]); // [address1, address2, address3, ...
    const [posts, setPosts] = useState(null);
    const [finalPosts, setFinalPosts] = useState([]);

    const [profileLoading, setProfileLoading] = useState(false);
    const [postsLoading, setPostsLoading] = useState(false);

    function loadProfile(){
        setProfileLoading(true);

        if(typeOfProfile === "self"){
            setProfile(userDetails);
            setPostAddresses(userDetails.posts);
            convertToImage(userDetails.profilePicture);
            setProfileLoading(false);
        }

        else if(typeOfProfile === "non-self" && userDetails.username === profileUser){
            setProfile(userDetails);
            setPostAddresses(userDetails.posts);
            convertToImage(userDetails.profilePicture);
            setProfileLoading(false);
        }

        else{
            async function getProfile() {
                    return await actor.getProfileDetails(profileUser);
            }

            getProfile().then(r => {
                setProfile(r["ok"]);
                const posts = r["ok"].posts;
                setPostAddresses(posts);
                convertToImage(r["ok"].profilePicture);
                setProfileLoading(false);
            });
        }
    }

    useEffect(() => {
        loadProfile();
    }, [typeOfProfile,userDetails]);

    useEffect(() => {
        setProfile(prevProfile => ({
            ...prevProfile,
            profilePicture: image
        }))
    }, [image]);

    useEffect(() => {
        if (postAddresses.length !== 0) {
            setPostsLoading(true);
            Promise.all(postAddresses.map(async (address) => {
                const post = await actor.getPost(address);
                return post["ok"];
            })).then(fetchedPosts => {
                setPosts(fetchedPosts);
                setPostsLoading(false);
            });
        }
    }, [postAddresses]);

    useEffect(() => {
        setProfile(prevProfile => ({
            ...prevProfile,
            profilePicture: image
        }))
    }, [image]);

    useEffect(() => {
        if (!postsLoading && posts !== null) {
            conversionOfBlobs(posts);
        }
    }, [posts]);

    useEffect(() => {
        setFinalPosts(updatedPosts);
    }, [updatedPosts]);

    useEffect(() => {
        setProfile(null);
        setPostAddresses([]);
        setPosts(null);
        setFinalPosts([]);
        loadProfile();
    }, [profileUser]);

    async function sendFriendRequest(username) {
        const date = new Date();
        const chatId = chatIdGenerator(userDetails.username, username);
        const res = await actor.sendFriendRequest(username,date.toISOString(),chatId);
        if(res["ok"]){
            setAlert({
                message: res["ok"],
                type: "success"
            })
        } else{
            setAlert({
                message: res["err"],
                type: "error"
            })
        }
    }

    async function acceptFriendRequest(username) {
        const date = new Date();
        const chatId = chatIdGenerator(userDetails.username, username);
        let res = await actor.acceptFriendRequest(username, date.toISOString(),chatId);
        if(res["ok"]){
            setAlert({
                message: res["ok"],
                type: "success"
            })
        } else{
            setAlert({
                message: res["err"],
                type: "error"
            })
        }
    }

    async function unFollow(username) {
        let res = await actor.unFollow(username);
        if(res["ok"]){
            setAlert({
                message: res["ok"],
                type: "success"
            })
        } else{
            setAlert({
                message: res["err"],
                type: "error"
            })
        }
    }

    async function fetchChats(){
        const chatId = chatIdGenerator(userDetails.username, profileUser);
        const profileDetails = await actor.getProfileDetails(profileUser);
        let chatProfilePic = profileDetails["ok"].profilePicture;
        const arrayBuffer = new Uint8Array(chatProfilePic).buffer;
        const imageBlob = new Blob([arrayBuffer], { type: 'image/jpeg' });
        chatProfilePic = URL.createObjectURL(imageBlob);
        let messages = await actor.getMessages(chatId);
        setSelectedChat({
            name: profileUser,
            profilePic: chatProfilePic,
            status: "Online",
            messages: messages
        })
    }

    return (
        <>
            {
                !profileLoading && profile
                    ?
                    <div id="profile-page">

                        {
                            deviceType !== 'mobile' &&
                            <div id="profile-top-container">

                                <div id="profile-image-container">
                                    <img src={profile.profilePicture}
                                         alt="Profile"/>
                                </div>

                                <div id="profile-info-container">
                                    <div id="profile-actions">
                                        <h1>{profile.username}</h1>

                                        <div className="action-group">
                                            {typeOfProfile === "self" ? (
                                                <div>Edit profile</div>
                                            ) : (
                                                userDetails.username !== profileUser ?
                                                <>
                                                    <div onClick={() => {
                                                        if (userDetails.friendRequests.includes(profileUser)) {
                                                            acceptFriendRequest(profileUser);
                                                            setUserDetails(prevUserDetails => ({
                                                                ...prevUserDetails,
                                                                following: prevUserDetails.following + BigInt(1),
                                                                friendRequests: prevUserDetails.friendRequests.filter(user => user !== profileUser),
                                                                followingList: [...prevUserDetails.followingList, profileUser]
                                                            }));
                                                        } else if (userDetails.followingList.includes(profileUser)) {
                                                            unFollow(profileUser);
                                                            setUserDetails(prevUserDetails => ({
                                                                ...prevUserDetails,
                                                                following: prevUserDetails.following - BigInt(1),
                                                                followingList: prevUserDetails.followingList.filter(user => user !== profileUser)
                                                            }));
                                                        } else {
                                                            sendFriendRequest(profileUser);
                                                            setUserDetails(prevUserDetails => ({
                                                                ...prevUserDetails,
                                                                following: prevUserDetails.following + BigInt(1),
                                                                followingList: [...prevUserDetails.followingList, profileUser]
                                                            }));
                                                        }
                                                    }}>
                                                        {
                                                            userDetails.friendRequests.includes(profileUser) ? "Follow Back" : userDetails.followingList.includes(profileUser) ? "Following" : "Follow"
                                                        }
                                                    </div>
                                                    <div onClick={() => {
                                                        navigate('/chat');
                                                        fetchChats();
                                                    }}>Message</div>
                                                </> : <div>Edit profile</div>

                                            )}
                                        </div>

                                    </div>

                                    <div id="profile-stats">
                                        <div
                                            id="followers">{profile.followers.toString()} Followers
                                        </div>
                                        <div
                                            id="following">{profile.following.toString()} Following
                                        </div>
                                        <div
                                            id="posts">{profile.postsCount.toString()} Posts
                                        </div>
                                    </div>

                                    <div id="profile-bio">
                                        <p>
                                            {profile.bio}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        }

                        {
                            deviceType === 'mobile' &&
                            <div id="profile-top-container">

                                <div id="names-section">
                                    <div id="profile-image-container">
                                        <img src={profile.profilePicture}
                                             alt="Profile"/>
                                    </div>

                                    <div id="profile-actions">
                                        <h1>{profile.username}</h1>

                                        <div className="action-group">
                                            {typeOfProfile === "self" ? (
                                                <div>Edit profile</div>
                                            ) : (
                                                userDetails.username !== profileUser ?
                                                    <>
                                                        <div onClick={() => {
                                                            if (userDetails.friendRequests.includes(profileUser)) {
                                                                acceptFriendRequest(profileUser);
                                                                setUserDetails(prevUserDetails => ({
                                                                    ...prevUserDetails,
                                                                    following: prevUserDetails.following + BigInt(1),
                                                                    friendRequests: prevUserDetails.friendRequests.filter(user => user !== profileUser),
                                                                    followingList: [...prevUserDetails.followingList, profileUser]
                                                                }));
                                                            } else if (userDetails.followingList.includes(profileUser)) {
                                                                unFollow(profileUser);
                                                                setUserDetails(prevUserDetails => ({
                                                                    ...prevUserDetails,
                                                                    following: prevUserDetails.following - BigInt(1),
                                                                    followingList: prevUserDetails.followingList.filter(user => user !== profileUser)
                                                                }));
                                                            } else {
                                                                sendFriendRequest(profileUser);
                                                                setUserDetails(prevUserDetails => ({
                                                                    ...prevUserDetails,
                                                                    following: prevUserDetails.following + BigInt(1),
                                                                    followingList: [...prevUserDetails.followingList, profileUser]
                                                                }));
                                                            }
                                                        }}>
                                                            {
                                                                userDetails.friendRequests.includes(profileUser) ? "Follow Back" : userDetails.followingList.includes(profileUser) ? "Following" : "Follow"
                                                            }
                                                        </div>
                                                        <div onClick={() => {
                                                            navigate('/chat');
                                                            setSelectedChat(profileUser);
                                                        }}>Message
                                                        </div>
                                                    </> : <div>Edit profile</div>

                                            )}
                                        </div>

                                    </div>

                                </div>

                                <div id="stats-section">
                                    <div id="profile-stats">
                                        <div
                                            id="followers">{profile.followers.toString()} Followers
                                        </div>
                                        <div
                                            id="following">{profile.following.toString()} Following
                                        </div>
                                        <div
                                            id="posts">{profile.postsCount.toString()} Posts
                                        </div>
                                    </div>

                                    <div id="profile-bio">
                                        <p>
                                            {
                                                profile.bio
                                            }
                                        </p>
                                    </div>
                                </div>

                            </div>
                        }

                        <div id="highlights-container">

                            <div className="highlight">
                                <div className="highlight-image" id={"add-highlight-container"}>
                                    <FontAwesomeIcon id={"add-highlight"} icon={faPlus}/>
                                </div>
                                <p>Add</p>
                            </div>

                            <div className="highlight">
                                <div className="highlight-image">
                                    <img src="https://picsum.photos/200" alt="Highlight"/>
                                </div>
                                <p>Highlight 1</p>
                            </div>

                        </div>

                        <div id="profile-bottom-container">

                            <div id="tabs-container">
                                <div className={`tab ${activeTab === "Posts" ? "active" : ""}`}
                                     onClick={() => setActiveTab("Posts")}>
                                    <FontAwesomeIcon icon={faImage}/>
                                    Posts
                                </div>
                                <div className={`tab ${activeTab === "Reels" ? "active" : ""}`}
                                     onClick={() => setActiveTab("Reels")}>
                                    <FontAwesomeIcon icon={faFilm}/>
                                    Reels
                                </div>
                                <div className={`tab ${activeTab === "Tagged" ? "active" : ""}`}
                                     onClick={() => setActiveTab("Tagged")}>
                                    <FontAwesomeIcon icon={faTag}/>
                                    Tagged
                                </div>
                                <div className={`tab ${activeTab === "Saved" ? "active" : ""}`}
                                     onClick={() => setActiveTab("Saved")}>
                                    <FontAwesomeIcon icon={faBookmark}/>
                                    Saved
                                </div>
                            </div>

                            <div id="profile-posts-container">
                                {
                                    !postsLoading ?
                                        (
                                            finalPosts.length !== 0 ?
                                                finalPosts.map((post, index) => {
                                                    return (
                                                        <div key={index} className="profile-post">
                                                            <img src={post.img} alt="Post"/>
                                                        </div>
                                                    )
                                                })
                                                : <div id={"no-posts"}>
                                                    <FontAwesomeIcon icon={faImage}/>
                                                    <p>No posts</p>
                                                </div>
                                        )
                                        : <Loader loading={"Loading Posts"}/>
                                }
                            </div>

                        </div>

                    </div>
                    : <Loader loading={"Loading Profile"}/>
            }
        </>

    )
}