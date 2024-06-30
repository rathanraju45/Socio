import React, {useContext, useEffect, useState} from 'react';
import './Login.css';

// importing the backend canister.
import {createActor, socio_backend} from "declarations/socio_backend/index.js";

// importing dfinity packages.
import {HttpAgent} from "@dfinity/agent";
import {AuthClient} from "@dfinity/auth-client";
import {GlobalStore} from "../../store/GlobalStore.jsx";

export default function Login({setLoading}) {

    const {loggedIn, setLoggedIn, identity, setIdentity, setActor} = useContext(GlobalStore);

    // backend canister as an actor.
    let actor = socio_backend;

    // use states
    const [II_URL, setII_URL] = useState(''); // internet identity url
    const [inLogin, setInLogin] = useState(false); // login status
    const [loginError, setLoginError] = useState(null);
    // use effects
    // assigning internet identity url on initial render.
    useEffect(() => {
        if (process.env.DFX_NETWORK === "local") {
            // Local url for providing internet identity only in chrome.
            setII_URL(`http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`);
        } else if (process.env.DFX_NETWORK === "ic") {
            setII_URL("https://identity.ic0.app");
        } else {
            setII_URL(`https://${process.env.CANISTER_ID_INTERNET_IDENTITY}.dfinity.network`);
        }
    }, []);

    async function getIdentity() {
        setIdentity(await actor.whoami());
    }

    // Function to handle Login with internet identity.
    async function handleLogin(e) {

        setLoading("Logging in");

        e.preventDefault();
        setInLogin(true);
        // creating an authentication client.
        let authClient = await AuthClient.create();
        try {
            await new Promise((resolve, reject) => {
                authClient.login({
                    identityProvider: II_URL,
                    onSuccess: resolve,
                    onError: reject
                })
            })

            setInLogin(false);

            // assigning the logged users identity to the actor.
            const identity = authClient.getIdentity();
            const agent = new HttpAgent({identity});
            actor = createActor(process.env.CANISTER_ID_SOCIO_BACKEND, {
                agent,
            });

            setActor(actor);
            setLoginError(null);
            await getIdentity();
            setLoggedIn(true);
            setLoading(null);
        } catch (error) {
            setInLogin(false);
            console.error('An error occurred during login:', error);
            setLoginError(error);
            setLoading(null);
        }

        return false;
    }

    return (
        <button id={"login"} disabled={inLogin} onClick={(event) => handleLogin(event)}>
            login
        </button>
    )
}