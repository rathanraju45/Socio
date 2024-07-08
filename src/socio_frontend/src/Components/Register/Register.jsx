import React, {useContext, useEffect, useState} from 'react';
import './Register.css';
import default_profile from "../../../public/images/illustrations/default_profile.png";
import {GlobalStore} from "../../store/GlobalStore.jsx";
import useConvertToBinary from "../../hooks/useConverToBinary.js";

function Register({setLoading}) {

    const {setAlert,actor, setUserDetails} = useContext(GlobalStore);
    const {binary, convertToBinary} = useConvertToBinary();

    const [username, setUsername] = useState('');
    const [displayname, setDisplayname] = useState('');
    const [binaryProfile, setBinaryProfile] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [bio, setBio] = useState('');
    const [bioWordCount, setBioWordCount] = useState(0);

    const [usernameError, setUsernameError] = useState(null);
    const [displayNameError, setDisplayNameError] = useState(null);
    const [profilePictureError, setProfilePictureError] = useState(null);

    useEffect(() => {
        setBinaryProfile(binary);
    }, [binary]);

    useEffect(() => {
        if (username !== null) {
            if (username.length < 5 || username.length > 20 || !/^[a-zA-Z0-9._]+$/.test(username)) {
                setUsernameError("Username must be between 5 and 20 characters and can only contain letters, numbers, periods, and underscores.");
            } else {
                setUsernameError(null);
            }
        }
    }, [username]);

    useEffect(() => {
        if (displayname !== null) {
            if (displayname.length <= 5 || displayname.length > 20) {
                setDisplayNameError("Display name must be between 5 and 20 characters.");
            } else {
                setDisplayNameError(null);
            }
        }
    }, [displayname]);

    useEffect(() => {
        if (profilePicture === null) {
            setProfilePictureError("Please select a profile picture.");
        } else {
            setProfilePictureError(null);
        }
    }, [profilePicture]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (usernameError || displayNameError || profilePictureError) {
            return;
        }

        setLoading("Registering");
        const usernameAvailable = await actor.usernameAvailablity(username);

        if (!usernameAvailable) {
            setUsernameError("Username is already taken.");
            setLoading(null);
            return;
        }

        const registerResult = await actor.registerUser({
            username: username,
            displayname: displayname,
            profilePicture: binaryProfile,
            bio: bio,
            followers: 0,
            following: 0,
            postsCount: 0,
            followerList : [],
            followingList : [],
            friendRequests : [],
            posts: [],
            reels: [],
            tagged: [],
            saved: [],
            notifications: [],
            chatIds: [],
        });

        if (registerResult["ok"]) {
            setAlert({message:registerResult["ok"],type:"success"});
            setUserDetails({
                username: username,
                displayname: displayname,
                profilePicture: binaryProfile,
                bio: bio,
                followers: BigInt(0),
                following: BigInt(0),
                postsCount: BigInt(0),
                followerList : [],
                followingList : [],
                friendRequests : [],
                posts: [],
                reels: [],
                tagged: [],
                saved: [],
                notifications : [],
                chatIds: [],
            })
        } else {
            setAlert({message:registerResult["err"],type:"error"});
        }
        setLoading(null);
    };

    const handleFileChange = async (event) => {
        setBinaryProfile(await convertToBinary(event.target.files[0]));
        setProfilePicture(URL.createObjectURL(event.target.files[0]));
    };

    const handleBioChange = (event) => {
        setBio(event.target.value);
        const words = event.target.value.split(/\s+/);
        setBioWordCount(event.target.value.trim() === '' ? 0 : words.length);
    };

    return (
        <>
            <h1 id={"register-details"}>Register with your details</h1>
            <form onSubmit={handleSubmit} id="register-form">
                <div id="profile-inputs">
                    <img
                        src={profilePicture === null ? default_profile : profilePicture}
                        onClick={() => document.getElementById('profilePictureInput').click()} // Trigger file input click
                        alt="Profile"
                    />
                    <p id={"update-profile-pic"}>*Click to update the profile pic</p>
                    <input
                        id="profilePictureInput"
                        type="file"
                        onChange={handleFileChange}
                        style={{display: 'none'}} // Hide file input
                    />
                    {profilePictureError && <p className={"error-msg"}>{profilePictureError}</p>}
                </div>

                <div id="text-inputs">

                    <label>
                        Username:
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        {usernameError && <p className={"error-msg"}>{usernameError}</p>}
                    </label>
                    <label>
                        Display Name:
                        <input type="text" value={displayname} onChange={(e) => setDisplayname(e.target.value)}/>
                        {displayNameError && <p className={"error-msg"}>{displayNameError}</p>}
                    </label>

                    <label>
                        Bio:
                        <textarea value={bio} maxLength={100} onChange={handleBioChange}/>
                        <p>{bioWordCount}/100</p>
                    </label>
                    <button id={"Register-button"} type="submit">Register</button>

                </div>

            </form>
        </>
    );
}

export default Register;