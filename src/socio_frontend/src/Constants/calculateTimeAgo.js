import {useMemo} from "react";

const calculateTimeAgo = (time) => {

    const currentTime = new Date();
    const sentTime = new Date(time);
    const differenceInMilliseconds = currentTime - sentTime;
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);

    let timeAgo;
    if (differenceInDays > 0) {
        timeAgo = `${differenceInDays}d`;
    } else if (differenceInHours > 0) {
        timeAgo = `${differenceInHours}h`;
    } else if (differenceInMinutes > 0) {
        timeAgo = `${differenceInMinutes}m`;
    } else {
        timeAgo = `${differenceInSeconds}s`;
    }

    return timeAgo;
};

export default calculateTimeAgo;