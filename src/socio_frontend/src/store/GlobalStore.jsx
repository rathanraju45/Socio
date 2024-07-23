import { createContext, useEffect, useState } from 'react';

/**
 * GlobalStore - A React context for managing global state across the application.
 * Provides a centralized store for managing user authentication, UI preferences, and device information.
 * @type {React.Context}
 */

export const GlobalStore = createContext();

/**
 * GlobalStoreProvider - A provider component for the GlobalStore context.
 * Wraps the application's component tree to provide global state access.
 *
 * Props:
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will have access to the global store.
 *
 * State Variables:
 * @state {boolean} loggedIn - Tracks whether a user is logged in. Default: false.
 * @state {Object|null} actor - Represents the current user's actor model. Default: null.
 * @state {Object|null} identity - Stores the current user's identity information. Default: null.
 * @state {Object|null} userDetails - Contains detailed information about the logged-in user. Default: null.
 * @state {Object|null} alert - Used to display alerts or notifications to the user. Default: null.
 * @state {boolean} darkMode - Indicates whether dark mode is enabled. Default: false or retrieved from localStorage.
 * @state {boolean} sideBarMinimized - Indicates whether the sidebar is minimized. Default: false.
 * @state {string} deviceType - Represents the type of device (e.g., 'desktop', 'mobile', 'tablet'). Default: 'desktop'.
 *
 * Functions:
 * @function toggleDarkMode - Toggles the dark mode setting.
 * @function toggleSideBar - Toggles the sidebar minimized state.
 * @function updateDeviceType - Updates the device type based on the window width.
 *
 * useEffect Hooks:
 * - Persists the `darkMode` state to localStorage on change.
 * - Adds a resize event listener on mount to update `deviceType` and removes it on unmount.
 *
 * @returns {React.Element} The provider element for the GlobalStore.
 */

// eslint-disable-next-line react/prop-types
export const GlobalStoreProvider = ({children}) => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [actor, setActor] = useState(null);
    const [identity, setIdentity] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [alert, setAlert] = useState(null);

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
            value={{alert, setAlert, darkMode, toggleDarkMode, setDarkMode, sideBarMinimized, toggleSideBar, deviceType, updateDeviceType, loggedIn, setLoggedIn, identity, setIdentity, actor, setActor, userDetails, setUserDetails}}>
            {
                children
            }
        </GlobalStore.Provider>
    )
}