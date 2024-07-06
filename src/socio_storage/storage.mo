import Blob "mo:base/Blob";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Principal "mo:base/Principal";

actor {

    type Result<Ok, Err> = {
        #ok : Ok;
        #err : Err;
    };

    type Post = {
        img : Blob;
        caption : Text;
        date : Text;
        owner : Principal;
    };

    type Video = {
        video : Blob;
        caption : Text;
        date : Text;
        owner : Principal;
    };

    private var posts : HashMap.HashMap<Text, Post> = HashMap.HashMap<Text, Post>(10, Text.equal, Text.hash);
    private stable var upgradePosts : [(Text, Post)] = [];

    private var videos : HashMap.HashMap<Text, Video> = HashMap.HashMap<Text, Video>(10, Text.equal, Text.hash);
    private stable var upgradeVideos : [(Text, Video)] = [];

    system func preupgrade(){
        upgradePosts := Iter.toArray(posts.entries());
        upgradeVideos := Iter.toArray(videos.entries());
    };

    system func postupgrade(){
        posts := HashMap.fromIter<Text, Post>(upgradePosts.vals(), 10, Text.equal, Text.hash);
        videos := HashMap.fromIter<Text, Video>(upgradeVideos.vals(), 10, Text.equal, Text.hash);
    };

    public func addPost(id : Text, img : Blob, caption : Text, date : Text, owner : Principal) : async Result<Text, Text> {
        try{
            let _ = posts.put(id, {img=img; caption=caption; date=date; owner=owner});
            return #ok("Post added to storage");
        } catch (error){
            return #err("Error adding post to storage");
        }
    };

    public func getPost(id: Text) : async ?Post {
        let post = posts.get(id);
        switch (post) {
            case null{
                return null;
            };
            case (?post){
                return ?post;
            }
        }
    };

    public func addVideo(id: Text, video : Blob, caption : Text, date : Text, owner : Principal) : async Result<Text, Text>{
        try{
            let _ = videos.put(id, {video=video; caption=caption; date=date; owner=owner});
            return #ok("Video added to storage");
        } catch (error){
            return #err("Error adding video to storage");
        }
    };

    public func getVideo(id: Text) : async ?Video {
        let video = videos.get(id);
        switch (video) {
            case null{
                return null;
            };
            case (?video){
                return ?video;
            }
        }
    };

    public func deletePost(id : Text) : async Text {
        let _ = posts.remove(id);
        return "Post deleted successfully!";
    };

    public func deleteVideo(id : Text) : async Text {
        let _ = videos.remove(id);
        return "Video deleted successfully!";
    };

    public func deleteUserStorage(postAddresses : [Text],videoAddresses : [Text]) : async Text {
        for (postAddress in postAddresses.vals()){
            let _ = posts.remove(postAddress);
        };
        for (videoAddress in videoAddresses.vals()){
            let _ = videos.remove(videoAddress);
        };
        return "User posts deleted successfully!";
    };

    public func deleteStorage() : async Text{
        posts := HashMap.HashMap<Text, Post>(10, Text.equal, Text.hash);
        videos := HashMap.HashMap<Text, Video>(10, Text.equal, Text.hash);
        return "Storage deleted successfully!";
    };

};