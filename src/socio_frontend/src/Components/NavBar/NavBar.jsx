// eslint-disable-next-line no-unused-vars
import React, {useContext} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faSearch,
    faPlusSquare,
    faCompass,
    faUser,
    faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import './NavBar.css';
import {useNavigate} from "react-router-dom";
import {AuthClient} from "@dfinity/auth-client";
import {GlobalStore} from "../../store/GlobalStore.jsx"; // Assuming you have a CSS file for styling

// eslint-disable-next-line react/prop-types
function NavBar({miscellaneous, miscellaneousType, handleCreateOpenModal,setSelectedChat}) {

    const {setLoggedIn} = useContext(GlobalStore);

    const navigate = useNavigate()

    return (
        <div className="nav-bar">
            <FontAwesomeIcon icon={faHome} onClick={() => {
                miscellaneous(false);
                navigate('/');
                setSelectedChat(null);
            }} />
            <FontAwesomeIcon icon={faSearch} onClick={() => {
                miscellaneous(true);
                miscellaneousType('search');
                setSelectedChat(null);
            }} />
            <FontAwesomeIcon icon={faPlusSquare} onClick={() => {
                miscellaneous(false);
                handleCreateOpenModal();
            }} />
            <FontAwesomeIcon icon={faCompass} onClick={() => {
                miscellaneous(false);
                navigate('/explore');
                setSelectedChat(null);
            }} />
            <FontAwesomeIcon icon={faUser} onClick={() => {
                miscellaneous(false);
                navigate('/profile');
                setSelectedChat(null);
            }} />
            <FontAwesomeIcon icon={faArrowRightFromBracket} onClick={async () => {
                const authClient = await AuthClient.create();
                await authClient.logout();
                navigate('/');
                setLoggedIn(false);
            }} />
        </div>
    );
}

export default NavBar;