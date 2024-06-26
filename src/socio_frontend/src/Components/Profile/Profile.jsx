// eslint-disable-next-line no-unused-vars
import React, {useContext, useEffect, useState} from "react";
import './Profile.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faImage, faFilm, faTag, faBookmark} from "@fortawesome/free-solid-svg-icons";
import default_profile from "../../../public/images/illustrations/default_profile.png";

import {GlobalStore} from "../../store/GlobalStore.jsx";
import useConvertToImage from "../../hooks/useConvertToImage.js";
import Loader from "../Loaders/Loader.jsx";

export default function Profile() {

    const {deviceType, actor} = useContext(GlobalStore);
    const {image, convertToImage} = useConvertToImage();

    const [activeTab, setActiveTab] = useState("Posts");/* Mobile styles */
    const [profile, setProfile] = useState(null);
    const [postAddresses, setPostAddresses] = useState([]); // [address1, address2, address3, ...
    const [posts, setPosts] = useState(null);

    const [profileLoading, setProfileLoading] = useState(false);
    const [postsLoading, setPostsLoading] = useState(false);

    useEffect(() => {
        setProfileLoading(true);

        async function getProfile() {
            return await actor.getUserDetails();
        }

        getProfile().then(r => {
            setProfile(r["ok"]);
            const posts = r["ok"].posts;
            setPostAddresses(posts);
            convertToImage(r["ok"].profilePicture);
            setProfileLoading(false);
        });
    }, []);

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
                return post;
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

    return (

        <div id="profile-page">

            {
                deviceType !== 'mobile' &&
                <div id="profile-top-container">

                    <div id="profile-image-container">
                        <img src={!profileLoading && profile !== null ? profile.profilePicture : default_profile}
                             alt="Profile"/>
                    </div>

                    <div id="profile-info-container">

                        <div id="profile-actions">
                            <h1>{!profileLoading && profile !== null ? profile.username : "---"}</h1>
                            <div className="action-group">
                                <div>Follow</div>
                                <div>Message</div>
                                <div>Edit profile</div>
                            </div>
                        </div>

                        <div id="profile-stats">
                            <div
                                id="followers">{!profileLoading && profile !== null ? profile.followers : "--"} Followers
                            </div>
                            <div
                                id="following">{!profileLoading && profile !== null ? profile.following : "--"} Following
                            </div>
                            <div id="posts">{!profileLoading && profile !== null ? profile.postsCount : "--"} Posts
                            </div>
                        </div>

                        <div id="profile-bio">
                            <p>
                                {!profileLoading && profile !== null ? profile.bio : "---"}
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
                            <img src={!profileLoading && profile !== null ? profile.profilePicture : default_profile}
                                 alt="Profile"/>
                        </div>

                        <div id="profile-actions">
                            <h1>{profile.username}</h1>
                            <div className="action-group">
                                <div>Follow</div>
                                <div>Message</div>
                                <div>Edit profile</div>
                            </div>
                        </div>
                    </div>

                    <div id="stats-section">
                        <div id="profile-stats">
                            <div
                                id="followers">{!profileLoading && profile !== null ? profile.followers : "--"} Followers
                            </div>
                            <div
                                id="following">{!profileLoading && profile !== null ? profile.following : "--"} Following
                            </div>
                            <div id="posts">{!profileLoading && profile !== null ? profile.postsCount : "--"} Posts
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
                                posts !== null ?
                                    posts.map((post, index) => {
                                        return (
                                            <div key={index} className="profile-post">
                                                <img src={post.img} alt="Post"/>
                                            </div>
                                        )
                                    })
                                    : <div id={"no-posts"}>
                                        <FontAwesomeIcon icon={faImage} />
                                        <p>No posts</p>
                                    </div>
                            )
                            : <Loader loading={"Loading Posts"} />
                    }
                </div>

            </div>

        </div>

    )
}