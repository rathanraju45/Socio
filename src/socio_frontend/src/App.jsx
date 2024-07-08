/**
 * The `App` component is the root component of the application.
 * It imports and uses the `SideBar` and `MainSection` components.
 * It also uses the `GlobalStore` to access the `darkMode` and `deviceType` states.
 * Depending on the `darkMode` state, it applies different CSS classes to the root div.
 * Depending on the `deviceType` state, it conditionally renders the `SideBar` component.
 *
 * @module App
 * @requires react
 * @requires ./store/GlobalStore.jsx
 * @requires ./App.css
 * @requires ./Components/SideBar/SideBar.jsx
 * @requires ./Components/MainSection/MainSection.jsx
 */

// eslint-disable-next-line no-unused-vars
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useLocation} from "react-router-dom";
import {GlobalStore} from "./store/GlobalStore.jsx"; // Importing the GlobalStore to access the application state

// importing css for App
import './App.css';
import SideBar from "./Components/SideBar/SideBar.jsx"; // Importing the SideBar component
import MainSection from "./Components/MainSection/MainSection.jsx";
import TopBar from "./Components/TopBar/TopBar.jsx";
import NavBar from "./Components/NavBar/NavBar.jsx";
import Notifications from "./Components/Notifications/Notifications.jsx";
import Search from "./Components/Search/Search.jsx";
import Create from "./Components/Create/Create.jsx";
import LandingPage from "./Components/LandingPage/LandingPage.jsx";
import Register from "./Components/Register/Register.jsx";
import Loader from "./Components/Loaders/Loader.jsx";
import Alert from "./Components/Alert/Alert.jsx";

/**
 * The `App` functional component.
 *
 * @function
 * @name App
 * @returns {JSX.Element} The rendered JSX element
 */

export default function App() {

    const [loading, setLoading] = useState(null);

    const miscellaneousRef = useRef(null);

    // Accessing the dark mode and device type from store.
    const {
        darkMode,
        deviceType,
        updateDeviceType,
        toggleSideBar,
        loggedIn,
        identity,
        actor,
        userDetails,
        setUserDetails
    } = useContext(GlobalStore); // Using the useContext hook to access the `darkMode` and `deviceType` states from the GlobalStore
    const location = useLocation();

    const [isCreateModalOpen, setIscCreateModalOpen] = useState(false);
    const handleCreateOpenModal = () => {
        setIscCreateModalOpen(true);
    };

    const handleCreateCloseModal = () => {
        setIscCreateModalOpen(false);
    }

    // Updating the device type on component mount
    useEffect(() => {
        updateDeviceType();
    }, []);

    useEffect(() => {
        if (location.pathname === '/chat' || location.pathname === '/explore') {
            toggleSideBar(true);
        }
    }, [location]);

    /**
     * The `App` component return statement.
     * It returns a div with a dynamic id based on the `darkMode` state.
     * Inside this div, it conditionally renders the `SideBar` component based on the `deviceType` state,
     * and always renders the `MainSection` component.
     */

    const [isMiscellaneousOpen, setIsMiscellaneousOpen] = useState(false);
    const [miscellaneousType, setMiscellaneousType] = useState('');

    useEffect(() => {
        async function getUserDetails() {
            return (await actor.getUserDetails());
        }

        if (identity !== null) {
            getUserDetails().then(r => {
                if (r["err"]) {
                    setUserDetails(null);
                } else {
                    setUserDetails(r["ok"]);
                }
            });
        }
    }, [identity]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMiscellaneousOpen && !miscellaneousRef.current.contains(event.target)) {
                setIsMiscellaneousOpen(false);
                toggleSideBar(false);
            }
        };

        // Listen for click events on the document
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMiscellaneousOpen]);

    return (
        <div className="App" id={darkMode ? "darkBG" : "lightBG"}>

            {loading && (
                <Loader loading={loading}/>
            )}

            <Alert />

            {
                loggedIn ?
                    userDetails === null ? <Register setLoading={setLoading}/> :
                        <>
                            <Create isOpen={isCreateModalOpen} onClose={handleCreateCloseModal} setLoading={setLoading}/>

                            {
                                <>
                                    {deviceType === 'mobile' &&
                                        <TopBar miscellaneous={setIsMiscellaneousOpen}
                                                miscellaneousType={setMiscellaneousType}/>}
                                    {deviceType !== 'mobile' &&
                                        <SideBar isCreateModalOpen={isCreateModalOpen}
                                                 handleCreateOpenModal={handleCreateOpenModal}
                                                 handleCreateCloseModal={handleCreateCloseModal}
                                                 miscellaneous={setIsMiscellaneousOpen}
                                                 miscellaneousType={setMiscellaneousType}
                                        />}
                                    <MainSection />
                                    <div id="miscellaneous" ref={miscellaneousRef}
                                         className={miscellaneousType !== '' && isMiscellaneousOpen ? "miscellaneous-open" : "miscellaneous-close"}
                                         style={{
                                             backgroundColor: darkMode ? 'rgb(0,0,0)' : 'rgb(245,245,245)',
                                         }}>
                                        {
                                            isMiscellaneousOpen &&
                                            miscellaneousType === 'notifications' ? <Notifications/> : <Search miscellaneous={setIsMiscellaneousOpen}/>
                                        }
                                    </div>
                                    {deviceType === 'mobile' &&
                                        <NavBar handleCreateOpenModal={handleCreateOpenModal}
                                                miscellaneous={setIsMiscellaneousOpen}
                                                miscellaneousType={setMiscellaneousType}
                                        />}
                                </>
                            }
                        </>
                    : <LandingPage setLoading={setLoading}/>

            }

        </div>
    )
}