import React, {useState} from "react";
import notifications from "../Constants/notifications.js";

export default function useConvertNotificationProfiles() {
    const [updatedNotifications, setUpdatedNotifications] = useState([]);

    const convertToImage = (binaryData) => {
        const arrayBuffer = new Uint8Array(binaryData).buffer;
        const imageBlob = new Blob([arrayBuffer], {type: 'image/jpeg'});
        return (URL.createObjectURL(imageBlob));
    }

    const convertNotifications = (notifications) => {
        setUpdatedNotifications(notifications.map((notification) => {
            const updatedNotification = {...notification};
            updatedNotification.profilePic = convertToImage(notification.profilePic);
            return updatedNotification;
        }));
    }

    return {updatedNotifications, convertNotifications};
}