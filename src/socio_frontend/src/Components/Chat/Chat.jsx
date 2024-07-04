/**
 * Chat Component
 * This component is responsible for rendering the chat interface.
 * It includes a list of chats, a search bar to filter chats, and a chat interface to send and receive messages.
 *
 * @module Chat
 */

// Importing necessary libraries and components
// eslint-disable-next-line no-unused-vars
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import chatData from "../../Constants/chatData.js";
import './Chat.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faFaceSmile,
    faImage,
    faMicrophone,
    faPaperPlane,
    faPhone,
    faTimes,
    faVideo
} from "@fortawesome/free-solid-svg-icons";
import {GlobalStore} from "../../store/GlobalStore.jsx";

/**
 * The main Chat component
 *
 * @returns {JSX.Element} The rendered Chat component
 */

export default function Chat() {

    // Using the GlobalStore to get the deviceType
    const {deviceType} = useContext(GlobalStore);

    // State variables
    const [selectedChat, setSelectedChat] = useState(null); // The chat that is currently selected
    const [searchTerm, setSearchTerm] = useState(''); // The search term to filter chats
    const [chats, setChats] = useState([]); // The list of chats
    const [messageInput, setMessageInput] = useState(''); // The message input

    // Use Effects
    // This effect is used to convert the chatData array into a dictionary with the chat name as the key
    useEffect(() => {
        const chatDict = chatData.reduce((dict, chat) => {
            dict[chat.name] = chat;
            return dict;
        }, {});
        setChats(chatDict);
    }, []);

    // This ref is used to scroll to the bottom of the chat messages when a new message is sent
    const messagesEndRef = useRef(null);

    // This effect is used to scroll to the bottom of the chat messages when a new message is sent
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [selectedChat,chats]);

    // Memoized functions
    // This function is used to filter the chats based on the search term
    const filteredChats = useMemo(() => {
        return searchTerm ? Object.values(chats).filter(chat =>
            chat.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];
    }, [searchTerm, chats]);

    // This function is used to calculate the time ago for a given time
    const calculateTimeAgo = useMemo(() => (time) => {

        const currentTime = new Date();
        const sentTime = new Date(time);
        const differenceInMilliseconds = currentTime - sentTime;
        const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        const differenceInHours = Math.floor(differenceInMinutes / 60);
        const differenceInDays = Math.floor(differenceInHours / 24);

        let timeAgo;
        if (differenceInDays > 0) {
            timeAgo = `${differenceInDays}d`;
        } else if (differenceInHours > 0) {
            timeAgo = `${differenceInHours}h`;
        } else if (differenceInMinutes > 0) {
            timeAgo = `${differenceInMinutes}m`;
        } else {
            timeAgo = `${differenceInSeconds}s`;
        }

        return timeAgo;
    }, []);

    // This function is used to render a chat
    const renderChat = (chat) => {
        const lastMessage = chat.messages[chat.messages.length - 1];
        const timeAgo = calculateTimeAgo(lastMessage.time);

        return (
            <div key={chat.id} onClick={() => setSelectedChat(chat)}>
                <img src={chat.profilePic} alt={chat.name}/>
                <div className="chat-details">
                    <p>{chat.name}</p>
                    <span className={"preview-section"}>
                    <p className={"chat-preview"}>{lastMessage.text}</p>
                    <span className={"chat-list-time"}>{timeAgo}</span>
                </span>
                </div>
            </div>
        );
    };

    // Event Handlers
    // This function is used to handle the key press event when the user presses 'Enter' to send a message
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
            event.preventDefault(); // Prevents the addition of a new line in the input after pressing 'Enter'
        }
    };

    // This function is used to send a message
    const sendMessage = () => {
        if (messageInput.trim() !== '') {
            // Create a new message
            const newMessage = {
                sender: 'You', // or use the actual username
                text: messageInput,
                time: new Date().toISOString(), // current time
            };

            // Find the chat where the message should be inserted
            const chatToUpdate = chats[selectedChat.name];

            // Insert the new message
            chatToUpdate.messages.push(newMessage);

            // Update the chats state
            setChats({
                ...chats,
                [selectedChat.name]: chatToUpdate,
            });

            // Clear the input box
            setMessageInput('');
        }
    };

    // Rendering the Chat component
    return (
        <div className="chat-page">

            <div style={
                {
                    display: deviceType === 'mobile' || deviceType === 'tablet' ? selectedChat ? 'none' : '' : ''
                }
            } id="chat-list">
                <h1>Chats</h1>
                <div id="chat-search">
                    <input
                        className={"chat-search-bar"}
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    {
                        searchTerm &&
                        <FontAwesomeIcon className={"chat-search-clear-icon"} icon={faTimes}
                                         onClick={() => setSearchTerm('')}/>
                    }
                </div>
                <div id="chat-list-data">
                    {searchTerm === '' ? (
                        Object.values(chats).map(chat => renderChat(chat))
                    ) : (
                        filteredChats.map(chat => renderChat(chat))
                    )}
                </div>

            </div>
            <div style={{
                display: deviceType === 'mobile' || deviceType === 'tablet' ? selectedChat ? '' : 'none' : ''
            }} id="chat-content">
                {
                    selectedChat ?
                        <div id={"selected-chat"}>
                            <div id={"chat-header"}>
                                <FontAwesomeIcon icon={faArrowLeft} className={"back-arrow"} onClick={() => setSelectedChat(null)} />
                                <img src={selectedChat.profilePic} alt={selectedChat.name}/>
                                <div id="selected-chat-details">
                                    <p>{selectedChat.name}</p>
                                    <span id="selected-chat-status">
                                        {selectedChat.status !== 'typing' && <span className={`status-circle ${selectedChat.status === 'Online' ? "green" : "grey"}`}/>}
                                        <p>{selectedChat.status}</p>
                                    </span>
                                </div>
                                <div id="call-section">
                                    <FontAwesomeIcon icon={faPhone}/>
                                    <FontAwesomeIcon icon={faVideo}/>
                                </div>
                            </div>
                            <div id="messages-section">
                                {
                                    selectedChat.messages.map((message, index) => (
                                        <div key={index}
                                             className={`message-item ${message.sender === 'You' ? 'my-message' : 'other-message'}`}>
                                            {
                                                message.sender !== 'You' ?
                                                    <div className="message-content">
                                                        <div className="message-sender-pic">
                                                            <img src={selectedChat.profilePic} alt={selectedChat.name}/>
                                                        </div>
                                                        <div>
                                                            <p>{message.text}</p>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div>
                                                        <p>{message.text}</p>
                                                    </div>
                                            }
                                        </div>))
                                }
                                <div ref={messagesEndRef}/>
                            </div>
                            <div id="chat-input">
                                <FontAwesomeIcon id={"emoji-icon"} icon={faFaceSmile}/>
                                <input type={"text"} placeholder="Type a message" value={messageInput}
                                       onChange={(e) => setMessageInput((e.target.value))}
                                        onKeyDown={handleKeyPress}
                                />
                                <div id="chat-input-icons">
                                    <FontAwesomeIcon icon={faImage}/>
                                    <FontAwesomeIcon icon={faMicrophone}/>
                                    <FontAwesomeIcon icon={faPaperPlane} onClick={sendMessage}/>
                                </div>
                            </div>
                        </div>
                        : <p className={"no-selected-chat"}>Please select a chat</p>
                }
            </div>
        </div>
    )
}