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
import useConvertChatProfiles from "../../hooks/useConvertChatProfiles.js";
import chatIdGenerator from "../../Constants/chatIdGenerator.js";
import useFetchMessages from "../../hooks/useFetchMessages.js";
import calculateTimeAgo from "../../Constants/calculateTimeAgo.js";

/**
 * The main Chat component
 *
 * @returns {JSX.Element} The rendered Chat component
 */

export default function Chat({selectedChat, setSelectedChat, setLoading}) {

    // Using the GlobalStore to get the deviceType
    const {setAlert,darkMode, deviceType, actor, userDetails} = useContext(GlobalStore);
    const {updatedChats, conversionOfChats} = useConvertChatProfiles();
    const {fetchMessages} = useFetchMessages();

    // State variables
    const [searchTerm, setSearchTerm] = useState(''); // The search term to filter chats
    const [chats, setChats] = useState({}); // The list of chats
    const [chatsArray, setChatsArray] = useState(null); // The list of chats as an array
    const [messageInput, setMessageInput] = useState(''); // The message input
    const [currentChatId, setCurrentChatId] = useState(''); // The current chat id

    const [messageSending, setMessageSending] = useState(false); // The message sending status

    // Use Effects
    // This effect is used to convert the chatData array into a dictionary with the chat name as the key
    useEffect(() => {
        async function convertChatData() {
            const chatPromises = userDetails.chatIds.map(async chatId => {
                const chatMembers = chatId.split(':');
                const friendUsername = chatMembers.filter(member => member !== userDetails.username)[0];
                setLoading("Loading chats...")
                const profileDetails = await actor.getProfileDetails(friendUsername);
                // setLoading(null);
                let chatProfilePic = profileDetails["ok"].profilePicture;
                let messages = await actor.getMessages(chatId);
                return {friendUsername, chatProfilePic, messages};
            });

            return await Promise.all(chatPromises);
        }

        if (userDetails.chatIds.length !== 0) {
            convertChatData().then(result => {
                setChatsArray(result);
            });
        }
    }, [userDetails.chatIds]);

    useEffect(() => {
        if (chatsArray !== null) {
            conversionOfChats(chatsArray);
        }
    }, [chatsArray]);

    useEffect(() => {
        if (updatedChats.length !== 0) {
            setLoading(null);
            let chatDict = {};
            updatedChats.forEach(chat => {
                chatDict[chat.friendUsername] = {
                    name: chat.friendUsername,
                    profilePic: chat.chatProfilePic,
                    status: 'Online',
                    messages: chat.messages
                };
            });
            setChats(chatDict);
        }
    }, [updatedChats]);

    useEffect(() => {
        if (selectedChat !== null) {
            setCurrentChatId(chatIdGenerator(userDetails.username, selectedChat.name));

            const intervalId = setInterval(() => {
                fetchMessages(chats, selectedChat, setChats, currentChatId);
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [selectedChat,currentChatId]);

    // This ref is used to scroll to the bottom of the chat messages when a new message is sent
    const messagesEndRef = useRef(null);

    // This effect is used to scroll to the bottom of the chat messages when a new message is sent
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [selectedChat, chats]);

    // Memoized functions
    // This function is used to filter the chats based on the search term
    const filteredChats = useMemo(() => {
        return searchTerm ? Object.values(chats).filter(chat =>
            chat.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];
    }, [searchTerm, chats]);

    // This function is used to render a chat
    const renderChat = (chat, index) => {
        const lastMessage = chat.messages[0].messages[chat.messages[0].messages.length - 1];
        const timeAgo = useMemo(() => calculateTimeAgo(new Date(lastMessage.date)), [lastMessage.date]);
        const isSelectedChat = selectedChat && chat.name === selectedChat.name;

        return (
            <div className="chat-item" style={{
                boxShadow: isSelectedChat ? deviceType === 'mobile' ? darkMode ? "0 0 10px rgba(255,255,255,0.3)" : "0 0 10px rgba(0,0,0,0.3)" : darkMode ? "0 0 10px rgba(255,255,255,0.7)" : "0 0 10px rgba(0,0,0,0.7)" : "",
            }} key={index}
                 onClick={() => setSelectedChat(chat)}>
                <img src={chat.profilePic} alt={chat.name}/>
                <div className="chat-details">
                    <p>{chat.name}</p>
                    <span className={"preview-section"}>
                    <p className={"chat-preview"}>{`${lastMessage.sender === userDetails.username ? "You" : lastMessage.sender}: ${lastMessage.message}`}</p>
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
            sendMessage().then((r) => {
                if(r !== null) setMessageSending(false);
                else setAlert({type: 'error', message: 'Failed to send message'});
            });
            event.preventDefault(); // Prevents the addition of a new line in the input after pressing 'Enter'
        }
    };

    // This function is used to send a message
    const sendMessage = async () => {
        let date = new Date().toISOString();
        if (messageInput.trim() !== '') {
            // Create a new message
            const newMessage = {
                sender: userDetails.username,
                message: messageInput,
                media: null,
                date: date, // current time
            };

            // Clear the input box
            setMessageInput('');
            setMessageSending(true);
            return await actor.postMessage(currentChatId, userDetails.username, [messageInput], [], date);
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
                        chats.length !== 0 ?
                            Object.values(chats).map((chat, index) => {
                                if (chat.messages[0].messages.length !== 0) {
                                    return renderChat(chat, index)
                                } else {
                                    return <p id="no-chats">No chats</p>;
                                }
                            })
                            : <p id="no-chats">No chats</p>
                    ) : (
                        filteredChats.map((chat, index) => {
                            if (chat.messages[0].messages.length !== 0) {
                                return renderChat(chat, index)
                            } else {
                                return <p id="no-chats">No chats</p>;
                            }
                        })
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
                                <FontAwesomeIcon icon={faArrowLeft} className={"back-arrow"}
                                                 onClick={() => setSelectedChat(null)}/>
                                <img src={selectedChat.profilePic} alt={selectedChat.name}/>
                                <div id="selected-chat-details">
                                    <p>{selectedChat.name}</p>
                                    <span id="selected-chat-status">
                                        {selectedChat.status !== 'typing' && <span
                                            className={`status-circle ${selectedChat.status === 'Online' ? "green" : "grey"}`}/>}
                                        <p>{selectedChat.status}</p>
                                    </span>
                                </div>
                                <div id="call-section">
                                    <FontAwesomeIcon icon={faPhone}/>
                                    <FontAwesomeIcon icon={faVideo}/>
                                </div>
                            </div>
                            <div id="messages-section">
                                <div ref={messagesEndRef}/>
                                {
                                    selectedChat.messages.map((messageGroup, groupIndex) =>
                                        messageGroup.messages.slice().reverse().map((message, messageIndex) => (
                                            <div key={`${groupIndex}-${messageIndex}`}
                                                 className={`message-item ${message.sender === userDetails.username ? 'my-message' : 'other-message'}`}>
                                                {
                                                    message.sender !== userDetails.username ?
                                                        <div className="message-content">
                                                            <div className="message-sender-pic">
                                                                <img src={selectedChat.profilePic}
                                                                     alt={selectedChat.name}/>
                                                            </div>
                                                            <div>
                                                                <p>{message.message}</p>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div>
                                                            <p>{message.message}</p>
                                                        </div>
                                                }
                                            </div>
                                        ))
                                    )
                                }
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