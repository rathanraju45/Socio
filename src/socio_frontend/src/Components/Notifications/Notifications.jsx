// eslint-disable-next-line no-unused-vars
import React from 'react';
import './Notifications.css';
import notifications from '../../Constants/notifications.js';

export default function Notifications() {

    return (
        <div className="notifications-section">
            <h1>Notifications</h1>
            <div id="notification-items">
                {notifications.map(notification => (
                    <div key={notification.id} className="notification-item">
                        <img src={notification.profilePic} alt="user avatar" className="avatar" /> {/* Replace "avatar_url" with the URL of the user's avatar */}
                        <div className="notification-text">
                            <div>{notification.user}</div>
                            <div>{notification.action}</div>
                        </div>
                        <span className="notification-time">{notification.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}