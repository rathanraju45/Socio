import React, {useState} from "react";
import './Loader.css';

export default function Loader({loading}){

    return (
        <div className="overlay">
            <div className="loader"></div>
            <p>{loading}</p>
        </div>
    )
}