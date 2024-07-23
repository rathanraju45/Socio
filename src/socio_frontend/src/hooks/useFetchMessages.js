import {useContext, useState} from "react";
import {GlobalStore} from "../store/GlobalStore.jsx";

export default function useFetchMessages(){
    const {actor} = useContext(GlobalStore);

    const fetchMessages = async (chats,selectedChat,setChats,currentChatId) => {
        let newMessages = await actor.getMessages(currentChatId);
        if(JSON.stringify(newMessages) === JSON.stringify(selectedChat.messages)) return;
        selectedChat.messages = newMessages;
        setChats({
            ...chats,
            [selectedChat.name]: selectedChat
        })
    }

    return {fetchMessages};

}