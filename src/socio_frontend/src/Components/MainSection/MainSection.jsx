/**
 * @file
 * This file defines the `MainSection` component of the application.
 * It imports and uses the `GlobalStore` to access and manipulate the `sideBarMinimized` state.
 * It defines and uses the `MainSection` functional component which returns a div with a child h2 element.
 *
 * @module MainSection
 * @requires react
 * @requires ./MainSection.css
 * @requires ../../store/GlobalStore.jsx
 */

// Importing necessary modules and components
// eslint-disable-next-line no-unused-vars
import React, {useContext, useState} from 'react';
import {Routes, Route} from "react-router-dom";
import './MainSection.css';
import {GlobalStore} from "../../store/GlobalStore.jsx";

import Chat from "../Chat/Chat.jsx";
import Explore from "../Explore/Explore.jsx";
import Profile from "../Profile/Profile.jsx";
import Story from "../Story/Story.jsx";
import Feed from "../Feed/Feed.jsx";

/**
 * The `MainSection` functional component.
 *
 * @function
 * @name MainSection
 * @returns {JSX.Element} The rendered JSX element
 */
export default function MainSection() {

    const [selectedChat, setSelectedChat] = useState(null); // The chat that is currently selected

    // Access the sidebar minimized state from the global store
    const {sideBarMinimized} = useContext(GlobalStore);

    const storiesData = [
        {name: 'John', image: 'https://randomuser.me/api/portraits/men/1.jpg'},
        {name: 'Emma', image: 'https://randomuser.me/api/portraits/women/1.jpg'},
        {name: 'Robert', image: 'https://randomuser.me/api/portraits/men/2.jpg'},
        {name: 'Sophia', image: 'https://randomuser.me/api/portraits/women/2.jpg'},
        {name: 'Michael', image: 'https://randomuser.me/api/portraits/men/3.jpg'},
        {name: 'Olivia', image: 'https://randomuser.me/api/portraits/women/3.jpg'},
        {name: 'William', image: 'https://randomuser.me/api/portraits/men/4.jpg'},
        {name: 'Ava', image: 'https://randomuser.me/api/portraits/women/4.jpg'},
        {name: 'James', image: 'https://randomuser.me/api/portraits/men/5.jpg'},
        {name: 'Isabella', image: 'https://randomuser.me/api/portraits/women/5.jpg'},
    ];

    // Define an array of possible captions
    const captions = [
        'First post. This is a long caption to test the "See More" functionality. '.repeat(20),
        'Second post. This is another long caption for testing. '.repeat(20),
        'Hello world. Yet another long caption. '.repeat(20),
        'Check this out. This is a long caption. '.repeat(20),
        'Amazing view. This is a long caption. '.repeat(20),
        'Love this place. This is a long caption. '.repeat(20),
        'Just chilling. This is a long caption. '.repeat(20),
        'Having a great time. This is a long caption. '.repeat(20),
        'Best day ever. This is a long caption. '.repeat(20),
        'Can\'t believe this. This is a long caption. '.repeat(20),
    ];

// Function to generate a random integer between min and max (inclusive)
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

// Define an array of possible usernames
    const usernames = [
        'JohnDoe',
        'Emma123',
        'Robert_the_Great',
        'SophiaLovesCats',
        'Michael1987',
        'Olivia_Rose',
        'WilliamShakespeare',
        'AvaGardner',
        'JamesBond',
        'IsabellaQueen',
    ];

// Define an array of sample video URLs
    const sampleVideos = [
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        // ... add more URLs as needed
    ];

// Generate the posts data
    const postsData = Array.from({length: 20}, (_, i) => ({
        media: i % 2 === 0 ? `https://picsum.photos/200?random=${i}` : sampleVideos[getRandomInt(0, sampleVideos.length - 1)],
        mediaType: i % 2 === 0 ? 'image' : 'video',
        caption: captions[getRandomInt(0, captions.length - 1)],
        username: usernames[getRandomInt(0, usernames.length - 1)],
        profilePic: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${getRandomInt(1, 99)}.jpg`,
    }));

    /**
     * The `MainSection` component return statement.
     * It returns a div with a dynamic class based on the `sideBarMinimized` state and a child h2 element.
     */
    return (
            <div className={`mainSection ${sideBarMinimized ? 'minimized' : ''}`}>
            <Routes>
                <Route path="/" element={
                    <div className="home-section">

                        <div className="home-main">

                            <div className="stories-section">
                                <Story image={"https://randomuser.me/api/portraits/men/10.jpg"} username={""}/>
                                {storiesData.map((story, index) => ( // Map over storiesData
                                    <Story key={index} image={story.image} username={story.name}/> // Render a Story component for each item
                                ))}
                            </div>

                            <div className="feed-section">
                                <Feed posts={postsData}/>
                            </div>

                        </div>

                        <div className="profile-section">
                            <div className="profile-content">
                                <img src="https://randomuser.me/api/portraits/men/3.jpg" alt="Profile"/>
                                <h3>John Doe</h3>
                                <span>Switch account</span>
                            </div>

                            <div className="suggestions">
                                <div className={"suggestions-header"}>
                                    <h3>Suggestions For You</h3>
                                    <span>See All</span>
                                </div>
                                {
                                    storiesData.map((value, index) => {
                                        return <div className="suggestion" key={index}>
                                            <img src={value.image}/>
                                            <p>{value.name}</p>
                                            <span>Follow</span>
                                        </div>
                                    })
                                }
                            </div>
                        </div>

                    </div>
                }/>
                <Route path="/chat" element={<Chat selectedChat={selectedChat} setSelectedChat={setSelectedChat} />}/>
                <Route path="/explore" element={<Explore/>}/>
                <Route path="/profile" element={<Profile typeOfProfile={"self"} setSelectedChat={setSelectedChat} />}/>
                <Route path={"/profile/:username"} element={<Profile typeOfProfile={"non-self"} setSelectedChat={setSelectedChat} />}/>
            </Routes>
        </div>
    )
}