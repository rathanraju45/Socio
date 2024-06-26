// eslint-disable-next-line no-unused-vars
import React, {useContext, useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faBell, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

import white_theme_full_logo from '../../../public/images/large_logos/white_theme_full.png';
import black_theme_full_logo from '../../../public/images/large_logos/black_theme_full.png';
import './TopBar.css';
import {GlobalStore} from "../../store/GlobalStore.jsx";
import {useNavigate} from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function TopBar({miscellaneous, miscellaneousType}) {
    const {darkMode,toggleDarkMode} = useContext(GlobalStore);
    const [chatCount, setChatCount] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0);
    const [shake, setShake] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
    if (notificationCount > 0) {
        setShake(true);
        setTimeout(() => setShake(false), 1000); // remove shake effect after 1 second
    }
}, [notificationCount]); // dependency array includes notificationCount

    return (
        <div className="top-bar">
            <img className={"top-bar-logo"} src={darkMode ? black_theme_full_logo : white_theme_full_logo} alt="logo" />
            <div className="top-bar-icons">
                <div className="icon dark-mode">
                    <FontAwesomeIcon icon={darkMode ? faSun : faMoon} onClick={toggleDarkMode}/>
                </div>
                <div className="icon chat" onClick={() => {
                    navigate('/chat');
                }}>
                    <FontAwesomeIcon icon={faComment} onClick={() => {
                        miscellaneous(false);
                    }}/>
                    {chatCount > 0 && <span className="chat-count">{chatCount}</span>}
                </div>
                <div className={`icon notifications ${shake ? 'shake-effect' : ''}`}>
                    <FontAwesomeIcon icon={faBell} onClick={() => {
                        miscellaneous(true);
                        miscellaneousType('notifications');
                    }}/>
                    {notificationCount > 0 && <span className="notification-count">{notificationCount}</span>}
                </div>
            </div>
        </div>
    );
}