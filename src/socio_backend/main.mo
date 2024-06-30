import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Bool "mo:base/Bool";
import storage "canister:socio_storage";

actor {

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
    };

    type UserBasicDetails = {
        username : Text;
        displayname : Text;
        profilePicture : Blob;
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

    type Users = HashMap.HashMap<Principal, UserDetails>;

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

    public func registerUser(userDetails : UserDetails) : async Result<Text, Text> {
        let caller = await whoami();
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

    public func updateUserDetails(userDetails : UserDetails) : async Result<Text, Text> {
        let caller = await whoami();
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

    public func getUserDetails() : async Result<UserDetails, Text> {
        let caller = await whoami();
        switch (users.get(caller)) {
            case null {
                return #err("User does not exist.");
            };
            case (?userDetails) {
                return #ok(userDetails);
            };
        };
    };

    public func getProfileDetails(username : Text) : async Result<UserDetails,Text> {
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
                        return #ok(userDetails);
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
                                    principal = Principal.fromText(principal);
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

    public func deleteUser() : async Result<Text, Text> {
        let caller = await whoami();
        switch (users.get(caller)) {
            case null {
                return #err("User does not exist.");
            };
            case _ {
                let _ = users.remove(caller);
                return #ok("User deleted successfully.");
            };
        };
    };

    public func deleteUsers() : async Text {
        users := HashMap.HashMap<Principal, UserDetails>(10, Principal.equal, Principal.hash);
        usernames := HashMap.HashMap<Text, Principal>(10, Text.equal, Text.hash);
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

    public func setPost(id : Text, img : Blob, caption : Text, date : Text) : async Result<Text, Text> {
        let res = await storage.addPost(id, img, caption, date, Principal.toText(await whoami()));
        switch (res) {
            case (#ok("Post added successfully!")) {
                let user = users.get(await whoami());
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
                        };
                        let _ = users.put(await whoami(), updatedUser);
                    };
                    case (_) {
                        return #err("Error adding post");
                    };
                };

                return #ok("Post added successfully!");
            };
            case (#err("Error adding post")) {
                return #err("Error adding post");
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

    public func setVideo(id : Text, video : Blob, caption : Text, date : Text) : async Result<Text, Text> {
        let res = await storage.addVideo(id, video, caption, date, Principal.toText(await whoami()));
        switch (res) {
            case (#ok("Video added successfully!")) {
                let user = users.get(await whoami());
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
                        };
                        let _ = users.put(await whoami(), updatedUser);
                    };
                    case (_) {
                        return #err("Error adding video");
                    };
                };
                return #ok("Video added successfully!");
            };
            case (#err("Error adding video")) {
                return #err("Error adding video");
            };
            case (_) {
                return #err("Unexpected Error.");
            };
        };
    };

};
