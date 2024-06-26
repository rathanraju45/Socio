import React from 'react';
import './Story.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"; // Assuming you have a CSS file for styling
import { faPlus } from '@fortawesome/free-solid-svg-icons';

/**
 * The `Story` functional component.
 *
 * @function
 * @name Story
 * @param {Object} props The properties passed to the component
 * @param {string} props.image The URL of the story image
 * @param {string} props.username The username of the story owner
 * @returns {JSX.Element} The rendered JSX element
 */
// eslint-disable-next-line react/prop-types
function Story({ image, username }) {
    return (
        <div className={"story-item"}>
            <div className="story">
                <img src={image} alt={username}/>
            </div>
            {
                username !== "" ? <p>{username}</p> :
                    <>
                        <FontAwesomeIcon icon={faPlus} className="add-story-icon"/>
                        <p>Your Story</p>
                    </>

            }

        </div>
    );
}

export default Story;