import React, {useContext, useState, useEffect} from 'react';
import './Alert.css';
import {GlobalStore} from "../../store/GlobalStore.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

export default function Alert() {

    const {alert, setAlert} = useContext(GlobalStore);

    const [isVisible, setIsVisible] = useState(false);
    const alertClass = alert && alert.type === 'success' ? 'alert-success' : 'alert-error';
    const handleClose = () => {
        setIsVisible(false);
    };

    useEffect(() => {
        if (alert !== null) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setAlert(null);
                setIsVisible(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    return isVisible && (
        <div className={`alert ${alertClass}`}>
            {alert && alert.message}
            <button onClick={handleClose} className="close-btn">{<FontAwesomeIcon icon={faTimes}/>}</button>
        </div>
    );
};