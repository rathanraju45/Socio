import Text "mo:base/Text";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Blob "mo:base/Blob";
import Array "mo:base/Array";

actor {

    type Message = {
        sender : Text;
        message : Text;
        media : Blob;
        date : Text;
    };

    type UserChats = {
        messages : [Message];
    };

    private var messagesStorage : HashMap.HashMap<Text, UserChats> = HashMap.HashMap<Text, UserChats>(10, Text.equal, Text.hash);
    private stable var upgradeMessagesStorage : [(Text, UserChats)] = [];

    private var messagesMapper : HashMap.HashMap<Principal, Text> = HashMap.HashMap<Principal, Text>(10, Principal.equal, Principal.hash);
    private stable var upgradeMessagesMapper : [(Principal, Text)] = [];

    system func preupgrade() {
        upgradeMessagesStorage := Iter.toArray(messagesStorage.entries());
        upgradeMessagesMapper := Iter.toArray(messagesMapper.entries());
    };

    system func postupgrade() {
        messagesStorage := HashMap.fromIter<Text, UserChats>(upgradeMessagesStorage.vals(), 10, Text.equal, Text.hash);
        messagesMapper := HashMap.fromIter<Principal, Text>(upgradeMessagesMapper.vals(), 10, Principal.equal, Principal.hash);
    };

    public func getMessages(principal : Principal) : async ?UserChats {
        let messagesId = messagesMapper.get(principal);
        switch (messagesId) {
            case (?messageId) {
                let messages = messagesStorage.get(messageId);
                return messages;
            };
            case null {
                return null;
            };
        };
    };

    public func postMessage(principal : Principal, sender : Text, message : Text, media : Blob, date : Text) : async ?Text {
        let messageId = messagesMapper.get(principal);
        switch (messageId) {
            case (?messageId) {
                let messages = messagesStorage.get(messageId);
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
                        let _ = messagesStorage.put(messageId, newUserChat);
                        return ?"message sent";
                    };
                    case null {
                        return null;
                    };
                };
            };
            case null {
                return null;
            };
        };
    };

};
