// eslint-disable-next-line no-unused-vars
import React from 'react';
import Post from '../Post/Post.jsx';
import './Feed.css';

// eslint-disable-next-line react/prop-types
export default function Feed({ posts }) {

    return (
        <div className="feed">
            {/* eslint-disable-next-line react/prop-types */}
            {posts.map((post, index) => (
                <Post key={index} post={post} />
            ))}
        </div>
    );
}