// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import './Create.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage, faMultiply} from "@fortawesome/free-solid-svg-icons";

// eslint-disable-next-line react/prop-types
export default function Create ({ isOpen, onClose }){
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleCaptionChange = (e) => {
        setCaption(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the file and caption to your server
        // and save them in your database.
        console.log(file, caption);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="upload-modal">
                <button className="close-button" onClick={onClose}>{<FontAwesomeIcon icon={faMultiply} />}</button>
                <form onSubmit={handleSubmit}>
                    {
                        !file && (
                            <div className="file-picker">
                                <FontAwesomeIcon icon={faImage}/>
                                <label htmlFor={"file-upload"}>
                                    <div>
                                        Upload a file
                                    </div>
                                </label>
                                <input id={"file-upload"} type="file" onChange={handleFileChange}/>
                            </div>
                        )
                    }

                    {
                        file &&
                        (
                            <div className="file-preview">
                                <div id="file-preview-container">
                                    <img src={URL.createObjectURL(file)} alt="Preview"/>
                                </div>

                                <div id="file-actions">
                                    <textarea id={"caption"} placeholder="Caption" value={caption}
                                           onChange={handleCaptionChange} maxLength={300}/>
                                    <button id={"create"} type="submit">Upload</button>
                                </div>
                            </div>
                        )
                    }
                </form>
        </div>
    );
};