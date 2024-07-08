import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Bool "mo:base/Bool";
import storage "canister:socio_storage";
import messages "canister:socio_messages_storage";

actor {

    type Notification = {
        notificationType : Text;
        message : Text;
        addresses : Text;
        date : Text;
        from : Text;
    };

    type UserDetails = {
        username : Text;
        displayname : Text;
        profilePicture : Blob;
        bio : Text;
        followers : Nat;
        following : Nat;
        postsCount : Nat;
        followerList : [Text];
        followingList : [Text];
        friendRequests : [Text];
        posts : [Text];
        reels : [Text];
        tagged : [Text];
        saved : [Text];
        notifications : [Notification];
        chatIds : [Text];
    };

    type UserBasicDetails = {
        username : Text;
        displayname : Text;
        profilePicture : Blob;
    };

    type PublicProfileDetails = {
        username : Text;
        displayname : Text;
        profilePicture : Blob;
        bio : Text;
        followers : Nat;
        following : Nat;
        postsCount : Nat;
        followerList : [Text];
        followingList : [Text];
        posts : [Text];
        reels : [Text];
        tagged : [Text];
    };

    type Result<Ok, Err> = {
        #ok : Ok;
        #err : Err;
    };

    type Post = {
        img : Blob;
        caption : Text;
        date : Text;
    };

    type Video = {
        video : Blob;
        caption : Text;
        date : Text;
    };

    type Message = {
        sender : Text;
        message : ?Text;
        media : ?Blob;
        date : Text;
    };

    type UserChats = {
        messages : [Message];
    };

    private var users : HashMap.HashMap<Principal, UserDetails> = HashMap.HashMap<Principal, UserDetails>(10, Principal.equal, Principal.hash);
    private stable var upgradeUsers : [(Principal, UserDetails)] = [];

    private var usernames : HashMap.HashMap<Text, Principal> = HashMap.HashMap<Text, Principal>(10, Text.equal, Text.hash);
    private stable var upgradeUsernames : [(Text, Principal)] = [];

    system func preupgrade() {
        upgradeUsers := Iter.toArray(users.entries());
        upgradeUsernames := Iter.toArray(usernames.entries());
    };

    system func postupgrade() {
        users := HashMap.fromIter<Principal, UserDetails>(upgradeUsers.vals(), 10, Principal.equal, Principal.hash);
        upgradeUsers := [];

        usernames := HashMap.fromIter<Text, Principal>(upgradeUsernames.vals(), 10, Text.equal, Text.hash);
        upgradeUsernames := [];
    };

    public shared (msg) func whoami() : async Principal {
        return msg.caller;
    };

    public shared (msg) func registerUser(userDetails : UserDetails) : async Result<Text, Text> {
        let caller = msg.caller;
        switch (usernames.get(userDetails.username)) {
            case null {
                usernames.put(userDetails.username, caller);
                users.put(caller, userDetails);
                return #ok("User registered successfully.");
            };
            case _ {
                return #err("Username already exists.");
            };
        };
    };

    public shared (msg) func updateUserDetails(userDetails : UserDetails) : async Result<Text, Text> {
        let caller = msg.caller;
        switch (users.get(caller)) {
            case null {
                return #err("User does not exist.");
            };
            case _ {
                users.put(caller, userDetails);
                return #ok("User details updated successfully.");
            };
        };
    };

    public shared (msg) func getUserDetails() : async Result<UserDetails, Text> {
        let caller = msg.caller;
        switch (users.get(caller)) {
            case null {
                return #err("User does not exist.");
            };
            case (?userDetails) {
                return #ok(userDetails);
            };
        };
    };

    public func getProfileDetails(username : Text) : async Result<PublicProfileDetails, Text> {
        switch (usernames.get(username)) {
            case null {
                return #err("User does not exist.");
            };
            case (?principal) {
                switch (users.get(principal)) {
                    case null {
                        return #err("User does not exist.");
                    };
                    case (?userDetails) {
                        let profileDetails = {
                            username = userDetails.username;
                            displayname = userDetails.displayname;
                            profilePicture = userDetails.profilePicture;
                            bio = userDetails.bio;
                            followers = userDetails.followers;
                            following = userDetails.following;
                            postsCount = userDetails.postsCount;
                            followerList = userDetails.followerList;
                            followingList = userDetails.followingList;
                            posts = userDetails.posts;
                            reels = userDetails.reels;
                            tagged = userDetails.tagged;
                        };
                        return #ok(profileDetails);
                    };
                };
            };
        };
    };

    public func usernameAvailablity(username : Text) : async Bool {
        return usernames.get(username) == null;
    };

    public func searchUsers(searchTerm : Text) : async [?UserBasicDetails] {
        let userNames : [Text] = Iter.toArray(usernames.keys());
        let matchedUsers : [Text] = Array.filter(
            userNames,
            func(username : Text) : Bool {
                Text.contains(username, #text searchTerm);
            },
        );

        let matchedPrincipals : [?Text] = Array.map(
            matchedUsers,
            func(username : Text) : ?Text {
                let res = usernames.get(username);
                switch (res) {
                    case (?principal) {
                        return ?Principal.toText(principal);
                    };
                    case (_) {
                        return null;
                    };
                };
            },
        );

        let matchedUserDetails : [?UserBasicDetails] = Array.map(
            matchedPrincipals,
            func(principal : ?Text) : ?UserBasicDetails {
                switch (principal) {
                    case (?principal) {
                        switch (users.get(Principal.fromText(principal))) {
                            case (?userDetails) {
                                return ?{
                                    username = userDetails.username;
                                    displayname = userDetails.displayname;
                                    profilePicture = userDetails.profilePicture;
                                };
                            };
                            case (_) {
                                return null;
                            };
                        };
                    };
                    case (_) {
                        return null;
                    };
                };
            },
        );

        return matchedUserDetails;
    };

    public shared (msg) func deleteUser() : async Result<Text, Text> {
        let caller = msg.caller;
        switch (users.get(caller)) {
            case null {
                return #err("User does not exist.");
            };
            case (?user) {
                let postAdresses = Array.map(
                    user.posts,
                    func(postId : Text) : Text {
                        postId;
                    },
                );
                let videoAdresses = Array.map(
                    user.posts,
                    func(videoId : Text) : Text {
                        videoId;
                    },
                );
                let _ = await storage.deleteUserStorage(postAdresses, videoAdresses);
                let _ = users.remove(caller);
                return #ok("User deleted successfully.");
            };
        };
    };

    public func deleteUsers() : async Text {
        users := HashMap.HashMap<Principal, UserDetails>(10, Principal.equal, Principal.hash);
        usernames := HashMap.HashMap<Text, Principal>(10, Text.equal, Text.hash);
        let _ = await storage.deleteStorage();
        let _ = await messages.deleteMessageStorage();
        return "All users deleted successfully.";
    };

    public func getUserNames() : async [Text] {
        return Iter.toArray(usernames.keys());
    };

    public func getPost(id : Text) : async Result<Post, Text> {
        let post = await storage.getPost(id);
        switch (post) {
            case null {
                return #err("Post does not exist.");
            };
            case (?post) {
                return #ok(post);
            };
        };
    };

    public shared (msg) func setPost(id : Text, img : Blob, caption : Text, date : Text) : async Result<Text, Text> {
        let caller = msg.caller;
        let res = await storage.addPost(id, img, caption, date, caller);
        switch (res) {
            case (#ok("Post added to storage")) {
                let user = users.get(caller);
                switch (user) {
                    case (?user) {
                        let updatedUser = {
                            username = user.username;
                            displayname = user.displayname;
                            profilePicture = user.profilePicture;
                            bio = user.bio;
                            followers = user.followers;
                            following = user.following;
                            postsCount = user.postsCount + 1;
                            followerList = user.followerList;
                            followingList = user.followingList;
                            friendRequests = user.friendRequests;
                            posts = Array.append(user.posts, [id]);
                            reels = user.reels;
                            tagged = user.tagged;
                            saved = user.saved;
                            notifications = user.notifications;
                            chatIds = user.chatIds;
                        };
                        let _ = users.put(caller, updatedUser);
                        return #ok("Post added successfully!");
                    };
                    case (_) {
                        return #err("Error updating user with the uploaded post");
                    };
                };
            };
            case (#err("Error adding post to storage")) {
                return #err("Error adding post to storage");
            };
            case (_) {
                return #err("Unexpected Error.");
            };
        };
    };

    public func getVideo(id : Text) : async Result<Video, Text> {
        let video = await storage.getVideo(id);
        switch (video) {
            case null {
                return #err("Video does not exist.");
            };
            case (?video) {
                return #ok(video);
            };
        };
    };

    public shared (msg) func setVideo(id : Text, video : Blob, caption : Text, date : Text) : async Result<Text, Text> {
        let caller = msg.caller;
        let res = await storage.addVideo(id, video, caption, date, caller);
        switch (res) {
            case (#ok("Video added to storage")) {
                let user = users.get(caller);
                switch (user) {
                    case (?user) {
                        let updatedUser = {
                            username = user.username;
                            displayname = user.displayname;
                            profilePicture = user.profilePicture;
                            bio = user.bio;
                            followers = user.followers;
                            following = user.following;
                            postsCount = user.postsCount + 1;
                            followerList = user.followerList;
                            followingList = user.followingList;
                            friendRequests = user.friendRequests;
                            posts = Array.append(user.posts, [id]);
                            reels = user.reels;
                            tagged = user.tagged;
                            saved = user.saved;
                            notifications = user.notifications;
                            chatIds = user.chatIds;
                        };
                        let _ = users.put(caller, updatedUser);
                        return #ok("Video added successfully!");
                    };
                    case (_) {
                        return #err("Error updating user with uploaded video");
                    };
                };
            };
            case (#err("Error adding video")) {
                return #err("Error adding video to storage");
            };
            case (_) {
                return #err("Unexpected Error.");
            };
        };
    };

    public shared (msg) func sendFriendRequest(username : Text, date : Text, chatId : Text) : async Result<Text, Text> {

        let caller = msg.caller;
        var callerUserName : Text = "";
        let user = users.get(caller);
        var following = false;

        let res = await createChatId(chatId);
        switch (res) {
            case "ok" {
                switch (user) {
                    case (?user) {
                        let alreadyFollowing = Array.find(user.followingList, func(following : Text) : Bool { following == username });
                        if (alreadyFollowing != null) {
                            return #err("Already following the user.");
                        } else {
                            callerUserName := user.username;
                            let updatedUser = {
                                username = user.username;
                                displayname = user.displayname;
                                profilePicture = user.profilePicture;
                                bio = user.bio;
                                followers = user.followers;
                                following = user.following + 1;
                                postsCount = user.postsCount;
                                followerList = user.followerList;
                                followingList = Array.append(user.followingList, [username]);
                                friendRequests = user.friendRequests;
                                posts = user.posts;
                                reels = user.reels;
                                tagged = user.tagged;
                                saved = user.saved;
                                notifications = user.notifications;
                                chatIds = Array.append(user.chatIds, [chatId]);
                            };
                            let _ = users.put(caller, updatedUser);
                            following := true;
                        };
                    };
                    case (_) {
                        following := false;
                    };
                };

                if (following == true) {
                    let friendPrincipal = usernames.get(username);
                    switch (friendPrincipal) {
                        case (?friendPrincipal) {
                            let friend = users.get(friendPrincipal);
                            switch (friend) {
                                case (?userDetails) {
                                    let updatedUser = {
                                        username = userDetails.username;
                                        displayname = userDetails.displayname;
                                        profilePicture = userDetails.profilePicture;
                                        bio = userDetails.bio;
                                        followers = userDetails.followers + 1;
                                        following = userDetails.following;
                                        postsCount = userDetails.postsCount;
                                        followerList = Array.append(userDetails.followerList, [callerUserName]);
                                        followingList = userDetails.followingList;
                                        friendRequests = Array.append(userDetails.friendRequests, [callerUserName]);
                                        posts = userDetails.posts;
                                        reels = userDetails.reels;
                                        tagged = userDetails.tagged;
                                        saved = userDetails.saved;
                                        notifications = Array.append(userDetails.notifications, [{ notificationType = "Friend Request"; message = " sent you a friend request."; addresses = ""; date = date; from = callerUserName }]);
                                        chatIds = userDetails.chatIds;
                                    };
                                    let _ = users.put(friendPrincipal, updatedUser);
                                    return #ok("Friend request sent successfully.");
                                };
                                case null {
                                    return #err("User does not exist.");
                                };
                            };
                        };
                        case null {
                            return #err("User does not exist.");
                        };
                    };
                } else {
                    return #err("Error sending friend request.");
                };
            };
            case "err" {
                return #err("Error creating chat id. Try again.");
            };
            case _ {
                return #err("Unexpected Error. Try again.");
            };
        };

    };

    public shared (msg) func acceptFriendRequest(username : Text, date : Text, chatId : Text) : async Result<Text, Text> {

        let caller = msg.caller;
        var callerUserName : Text = "";
        let user = users.get(caller);
        var following = false;

        switch (user) {
            case (?userDetails) {
                let alreadyFollowing = Array.find(userDetails.followingList, func(following : Text) : Bool { following == username });
                let hasFriendRequest = Array.find(userDetails.friendRequests, func(friend : Text) : Bool { friend == username });
                if (alreadyFollowing == null and hasFriendRequest == null) {
                    return #err("Something went wrong.");
                } else {
                    callerUserName := userDetails.username;
                    let updatedUser = {
                        username = userDetails.username;
                        displayname = userDetails.displayname;
                        profilePicture = userDetails.profilePicture;
                        bio = userDetails.bio;
                        followers = userDetails.followers;
                        following = userDetails.following + 1;
                        postsCount = userDetails.postsCount;
                        followerList = userDetails.followerList;
                        followingList = Array.append(userDetails.followingList, [username]);
                        friendRequests = Array.filter(userDetails.friendRequests, func(friend : Text) : Bool { friend != username });
                        posts = userDetails.posts;
                        reels = userDetails.reels;
                        tagged = userDetails.tagged;
                        saved = userDetails.saved;
                        notifications = userDetails.notifications;
                        chatIds = Array.append(userDetails.chatIds, [chatId]);
                    };
                    let _ = users.put(caller, updatedUser);
                    following := true;
                };
            };
            case null {
                return #err("User does not exist.");
            };
        };

        if (following == true) {
            let friendPrincipal = usernames.get(username);
            switch (friendPrincipal) {
                case (?friendPrincipal) {
                    let friend = users.get(friendPrincipal);
                    switch (friend) {
                        case (?userDetails) {
                            let updatedUser = {
                                username = userDetails.username;
                                displayname = userDetails.displayname;
                                profilePicture = userDetails.profilePicture;
                                bio = userDetails.bio;
                                followers = userDetails.followers + 1;
                                following = userDetails.following;
                                postsCount = userDetails.postsCount;
                                followerList = Array.append(userDetails.followerList, [callerUserName]);
                                followingList = userDetails.followingList;
                                friendRequests = userDetails.friendRequests;
                                posts = userDetails.posts;
                                reels = userDetails.reels;
                                tagged = userDetails.tagged;
                                saved = userDetails.saved;
                                notifications = Array.append(userDetails.notifications, [{ notificationType = "Accept Request"; message = " accepted your friend request."; addresses = ""; date = date; from = callerUserName }]);
                                chatIds = userDetails.chatIds;
                            };
                            let _ = users.put(friendPrincipal, updatedUser);
                            return #ok("Friend request accepted successfully.");
                        };
                        case null {
                            return #err("User does not exist.");
                        };
                    };
                };
                case null {
                    return #err("User does not exist.");
                };
            };
        } else {
            return #err("Error accepting friend request.");
        };
    };

    public shared (msg) func unFollow(username : Text) : async Result<Text, Text> {

        let caller = msg.caller;
        var callerUserName : Text = "";
        let user = users.get(caller);
        var unfollowed = false;

        switch (user) {
            case (?userDetails) {
                let followingUser = Array.find(userDetails.followingList, func(following : Text) : Bool { following == username });
                if (followingUser == null) {
                    return #err("Not following yet.");
                } else {
                    callerUserName := userDetails.username;
                    let updatedUser = {
                        username = userDetails.username;
                        displayname = userDetails.displayname;
                        profilePicture = userDetails.profilePicture;
                        bio = userDetails.bio;
                        followers = userDetails.followers;
                        following = userDetails.following - 1;
                        postsCount = userDetails.postsCount;
                        followerList = userDetails.followerList;
                        followingList = Array.filter(userDetails.followingList, func(following : Text) : Bool { following != username });
                        friendRequests = userDetails.friendRequests;
                        posts = userDetails.posts;
                        reels = userDetails.reels;
                        tagged = userDetails.tagged;
                        saved = userDetails.saved;
                        notifications = userDetails.notifications;
                        chatIds = userDetails.chatIds;
                    };
                    let _ = users.put(caller, updatedUser);
                    unfollowed := true;
                };
            };
            case null {
                return #err("User does not exist.");
            };
        };

        if (unfollowed == true) {
            let friendPrincipal = usernames.get(username);
            switch (friendPrincipal) {
                case (?friendPrincipal) {
                    let friend = users.get(friendPrincipal);
                    switch (friend) {
                        case (?userDetails) {
                            let updatedUser = {
                                username = userDetails.username;
                                displayname = userDetails.displayname;
                                profilePicture = userDetails.profilePicture;
                                bio = userDetails.bio;
                                followers = userDetails.followers - 1;
                                following = userDetails.following;
                                postsCount = userDetails.postsCount;
                                followerList = Array.filter(userDetails.followerList, func(follower : Text) : Bool { follower != callerUserName });
                                followingList = userDetails.followingList;
                                friendRequests = userDetails.friendRequests;
                                posts = userDetails.posts;
                                reels = userDetails.reels;
                                tagged = userDetails.tagged;
                                saved = userDetails.saved;
                                notifications = userDetails.notifications;
                                chatIds = userDetails.chatIds;
                            };
                            let _ = users.put(friendPrincipal, updatedUser);
                            return #ok("User unfollowed successfully.");
                        };
                        case null {
                            return #err("User does not exist.");
                        };
                    };
                };
                case null {
                    return #err("User does not exist.");
                };
            };
        } else {
            return #err("Error unfollowing user.");
        };
    };

    public func createChatId(chatId : Text) : async Text {
        let res = await messages.createChatId(chatId);
        switch (res) {
            case (#ok("Chat id created")) {
                return "ok";
            };
            case _ {
                return "null";
            };
        };
    };

    public func getMessages(chatId : Text) : async ?UserChats {
        let result = await messages.getMessages(chatId);
        return result;
    };

    public func postMessage(chatId : Text, sender : Text, message : ?Text, media : ?Blob, date : Text) : async ?Text {
        let result = await messages.postMessage(chatId, sender, message, media, date);
        switch (?result) {
            case (?res) {
                return res;
            };
            case null {
                return null;
            };
        };
    };

};
