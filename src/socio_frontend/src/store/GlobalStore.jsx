import {createContext, useEffect, useState} from 'react';

/**
 * GlobalStore - The context object for the global store.
 * @type {React.Context}
 */

export const GlobalStore = createContext();

/**
 * GlobalStoreProvider - The provider component for the global store.
 * @param {Object} props - The props for the component.
 * @param {React.ReactNode} props.children - The children nodes of the provider.
 * @returns {React.Element} The provider element for the global store.
 */

// eslint-disable-next-line react/prop-types
export const GlobalStoreProvider = ({children}) => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [actor, setActor] = useState(null);
    const [identity, setIdentity] = useState(null);
    const [userDetails, setUserDetails] = useState(null);

    /**
     * darkMode - The state variable for the dark mode setting.
     * @type {boolean}
     */
    const [darkMode, setDarkMode] = useState(() => {
        const localDarkMode = localStorage.getItem('darkMode');
        return localDarkMode === 'true';
    });

    /**
     * toggleDarkMode - The function to toggle the dark mode setting.
     */
    const toggleDarkMode = () => {
        setDarkMode(prevDarkMode => !prevDarkMode);
    };

    // Save the dark mode setting to local storage whenever it changes.
    useEffect(() => {
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    /**
     * sideBarMinimized - The state variable for the sidebar minimized setting.
     * @type {boolean}
     */
    const [sideBarMinimized, setSideBarMinimized] = useState(false);

    /**
     * toggleSideBar - The function to toggle the sidebar minimized setting.
     * @param {boolean} toggleValue - The new value for the sidebar minimized setting.
     */
    const toggleSideBar = (toggleValue) => {
        setSideBarMinimized(toggleValue);
    };

    /**
     * deviceType - The state variable for the device type.
     * @type {string}
     */
    const [deviceType, setDeviceType] = useState('desktop');

    /**
     * updateDeviceType - The function to update the device type based on the window width.
     */
    const updateDeviceType = () => {
        const width = window.innerWidth;

        if (width <= 767) {
            setDeviceType('mobile');
        }
        else if(width <= 1024) {
                setDeviceType('tablet');
                setSideBarMinimized(true);
        } else {
            setDeviceType('desktop');
        }
    };

    // Return the provider element for the global store.
    return (
        <GlobalStore.Provider
            value={{darkMode, toggleDarkMode, sideBarMinimized, toggleSideBar, deviceType, updateDeviceType, loggedIn, setLoggedIn, identity, setIdentity, actor, setActor, userDetails, setUserDetails}}>
            {
                children
            }
        </GlobalStore.Provider>
    )
}