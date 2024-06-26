import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Blob "mo:base/Blob";
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
        posts : [Blob];
        reels : [Blob];
        tagged : [Blob];
        saved : [Blob];
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

    public func usernameAvailablity(username : Text) : async Bool {
        return usernames.get(username) == null;
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

    public func setPost(id: Text, img : Blob, caption : Text, date : Text) : async Result<Text, Text> {
        let res = await storage.addPost(id, img, caption, date);
        return #ok(res);
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

    public func setVideo(id: Text, video : Blob, caption : Text, date : Text) : async Result<Text, Text> {
        let res = await storage.addVideo(id, video, caption, date);
        return #ok(res);
    };

};
