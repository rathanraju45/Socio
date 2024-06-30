// eslint-disable-next-line no-unused-vars
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import './Search.css';
import {GlobalStore} from "../../store/GlobalStore.jsx";

import useConvertProfileImages from "../../hooks/useConverProfileImages.js";
import {useNavigate} from "react-router-dom";
import Loader from "../Loaders/Loader.jsx";

export default function Search() {

    const navigate = useNavigate();

    const {actor} = useContext(GlobalStore);
    const {updatedAccounts, convertAccounts} = useConvertProfileImages();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermLoading, setSearchTermLoading] = useState(false);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [finalFilteredAccounts, setFinalFilteredAccounts] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);

    // Define the function to filter accounts
    const filterAccountsSetter = async () => {
        return await actor.searchUsers(searchTerm);
    };

    useEffect(() => {
        setFilteredAccounts([]);
        setFinalFilteredAccounts([]);
        if (searchTerm !== '') {
            setSearchTermLoading(true);
            filterAccountsSetter().then((response) => {
                setFilteredAccounts(response);
                setSearchTermLoading(false);
            });
        } else {
            setFilteredAccounts([]);
            setFinalFilteredAccounts([]);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (filteredAccounts.length !== 0) {
            convertAccounts(filteredAccounts);
        }
    }, [filteredAccounts]);

    useEffect(() => {
        setFinalFilteredAccounts(updatedAccounts);
    }, [updatedAccounts]);

    const clearRecentSearch = () => {
        setRecentSearches([]);
    }

    return (
        <div className="search-result-section">
            <h1>Search</h1>

            <div className="input-container">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                />
                {searchTerm &&
                    <div onClick={() => setSearchTerm('')} className="clear-search"><FontAwesomeIcon icon={faTimes}/>
                    </div>}
            </div>
            <div id="recent-search-header">
                <h3>Recent Searches</h3>
                <p onClick={clearRecentSearch}>Clear all</p>
            </div>
            {searchTerm === '' ? (
                <div className="recent-searches">
                    {
                        recentSearches.length === 0 ? <h3 id={"no-recent"}>No recent searches</h3> :
                            recentSearches.map((search, index) => (
                                <div key={index} className="search-result-account">
                                    <img src={search[index].profilePicture} alt={search[index].username}/>
                                    <div className="search-result-account-details">
                                        <p className={"search-result-username"}>{search[index].username}</p>
                                        <p className={"search-result-displayname"}>{search[index].displayname}</p>
                                    </div>
                                    <span className={"remove-searched-result"}
                                          onClick={() => setRecentSearches(recentSearches.filter(item => item !== search))}>
                                        <FontAwesomeIcon icon={faTimes}/>
                                    </span>
                                </div>
                            ))}
                </div>
            ) : (
                <div className="search-results">
                    {
                        searchTermLoading ? <Loader loading={"Searching"} />:
                        finalFilteredAccounts.length === 0 ? <h3 id={"no-results"}>No results found</h3> :
                            finalFilteredAccounts.map((account, index) => (
                                <div key={index} className="search-result-account" onClick={() => {
                                    if (!recentSearches.includes(account)) {
                                        setRecentSearches([...recentSearches, account]);
                                    }
                                    navigate(`/profile/${account[index].username}`)
                                }}>
                                    <img src={account[index].profilePicture} alt={account[index].username}/>
                                    <div className="search-result-account-details">
                                        <p className={"search-result-username"}>{account[index].username}</p>
                                        <p className={"search-result-displayname"}>{account[index].displayname}</p>
                                    </div>
                                </div>
                            ))}
                </div>
            )}
        </div>
    );
}