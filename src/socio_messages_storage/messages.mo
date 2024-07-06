import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Result "mo:base/Result";

actor {

    type Message = {
        sender : Text;
        message : ?Text;
        media : ?Blob;
        date : Text;
    };

    type UserChats = {
        messages : [Message];
    };

    type Result<Ok, Err> = {
        #ok : Ok;
        #err : Err;
    };

    private var messagesStorage : HashMap.HashMap<Text, UserChats> = HashMap.HashMap<Text, UserChats>(10, Text.equal, Text.hash);
    private stable var upgradeMessagesStorage : [(Text, UserChats)] = [];

    system func preupgrade() {
        upgradeMessagesStorage := Iter.toArray(messagesStorage.entries());
    };

    system func postupgrade() {
        messagesStorage := HashMap.fromIter<Text, UserChats>(upgradeMessagesStorage.vals(), 10, Text.equal, Text.hash);
    };

    public func getMessages(chatId : Text) : async ?UserChats {
        let messages = messagesStorage.get(chatId);
        return messages;
    };

    public func createChatId(chatId : Text) : async Result<Text, Text>{
        let res = messagesStorage.get(chatId);
        switch(res){
            case (?res){
                return #err("Chat id already exists");
            };
            case null{
                let _ = messagesStorage.put(chatId, {messages = []});
                return #ok("Chat id created");
            };
        }
    };

    public func postMessage(chatId : Text, sender : Text, message : ?Text, media : ?Blob, date : Text) : async ?Text {
        let messages = messagesStorage.get(chatId);
        let newMessage = {
            sender = sender;
            message = message;
            media = media;
            date = date;
        };
        switch (messages) {
            case (?userChats) {
                let newUserChat = {
                    messages = Array.append(userChats.messages, [newMessage]);
                };
                let _ = messagesStorage.put(chatId, newUserChat);
                return ?"message sent";
            };
            case null {
                return null;
            };
        };
    };

    public func deleteMessageStorage() : async Text{
        messagesStorage := HashMap.HashMap<Text, UserChats>(10, Text.equal, Text.hash);
        return "messages storage deleted";
    };

};
