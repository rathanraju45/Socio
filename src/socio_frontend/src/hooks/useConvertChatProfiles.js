import {useState} from 'react';

export default function useConvertChatProfiles() {
    const [updatedChats, setUpdatedChats] = useState([]);

    const convertToImage = (binaryData) => {
        const arrayBuffer = new Uint8Array(binaryData).buffer;
        const imageBlob = new Blob([arrayBuffer], {type: 'image/jpeg'});
        return(URL.createObjectURL(imageBlob));
    };

    const conversionOfChats = (chats) => {
        setUpdatedChats(chats.map(chat => {
            const updatedChat = {...chat};
            updatedChat.chatProfilePic = convertToImage(chat.chatProfilePic);
            return updatedChat;
        }));
    }

    return {updatedChats, conversionOfChats};
};