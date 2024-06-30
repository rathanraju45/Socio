import {useState} from 'react';

export default function useConvertPostsImages() {
    const [updatedPosts, setUpdatedPosts] = useState([]);

    const convertToImage = (binaryData) => {
        const arrayBuffer = new Uint8Array(binaryData).buffer;
        const imageBlob = new Blob([arrayBuffer], {type: 'image/jpeg'});
        return(URL.createObjectURL(imageBlob));
    };

    const conversionOfBlobs = (posts) => {
        setUpdatedPosts(posts.map(post => {
            const updatedPost = {...post};
            updatedPost.img = convertToImage(post.img);
            return updatedPost;
        }));
    }

    return {updatedPosts, conversionOfBlobs};
};