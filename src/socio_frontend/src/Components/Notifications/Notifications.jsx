// eslint-disable-next-line no-unused-vars
import React, {useContext, useEffect, useState} from 'react';
import './Notifications.css';
import {GlobalStore} from "../../store/GlobalStore.jsx";
import useConvertNotificationProfiles from "../../hooks/useConvertNotificationProfiles.js";
import {useNavigate} from "react-router-dom";

export default function Notifications() {

    const navigate = useNavigate();

    const {actor, userDetails} = useContext(GlobalStore);
    const [tempNotifications, setTempNotifications] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const {updatedNotifications, convertNotifications} = useConvertNotificationProfiles();

    useEffect(() => {
        if(updatedNotifications.length !== 0){
            setNotifications(updatedNotifications);
        }
    }, [updatedNotifications]);

    useEffect(() => {
        if(tempNotifications.length !== 0){
            convertNotifications(tempNotifications);
        }
    }, [tempNotifications]);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (userDetails.notifications.length !== 0) {
                let finalNotifications = [];
                for (const notification of userDetails.notifications) {
                    let res = await actor.getProfileDetails(notification.from);
                    let notificationItem = {
                        profilePic: res["ok"].profilePicture,
                        from: notification.from,
                        action: notification.message,
                        notificationType: notification.notificationType,
                        addresses: notification.addresses,
                        date: notification.date,
                    };
                    finalNotifications.push(notificationItem);
                }
                setTempNotifications(finalNotifications);
            }
        };
        if(userDetails.notifications.length !== 0){
            fetchNotifications();
        }
    }, [userDetails.notifications]);

    function calculateTimeDifference(isoDateString) {
        const dateFromISO = new Date(isoDateString);
        const currentDate = new Date();
        const differenceInMilliseconds = currentDate - dateFromISO;
        const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        const differenceInHours = Math.floor(differenceInMinutes / 60);
        const differenceInDays = Math.floor(differenceInHours / 24);

        if (differenceInDays > 0) {
            return `${differenceInDays}d`;
        } else if (differenceInHours > 0) {
            return `${differenceInHours}h`;
        } else if (differenceInMinutes > 0) {
            return `${differenceInMinutes}m`;
        } else {
            return `${differenceInSeconds}s`;
        }
    }

    return (
        <div className="notifications-section">
            <h1>Notifications</h1>
            <div id="notification-items">
                {notifications.length !== 0 ? notifications.map((notification, index) => (
                    <div key={index} className="notification-item" onClick={() => {
                        navigate(`/profile/${notification.from}`)
                    }}>
                        <img src={notification.profilePic} alt="user avatar" className="avatar"/>
                        <div className="notification-text">
                            <div>{notification.from}
                                <span className="notification-time">{calculateTimeDifference(notification.date)}</span>
                            </div>
                            <div>{notification.action}</div>
                        </div>

                    </div>
                )) : <div className="notification-item">No notifications</div>}
            </div>
        </div>
    );
}