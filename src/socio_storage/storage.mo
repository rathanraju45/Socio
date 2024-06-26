import Blob "mo:base/Blob";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

actor {

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

    public func addPost(id : Text, img : Blob, caption : Text, date : Text) : async Text {
        let _ = posts.put(id, {img=img; caption=caption; date=date});
        return "Post added successfully!"
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

    public func addVideo(id: Text, video : Blob, caption : Text, date : Text) : async Text {
        let _ = videos.put(id, {video=video; caption=caption; date=date});
        return "Video added successfully!";
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

};