// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {accounts} from '../../Constants/accounts.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import './Search.css';

export default function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        if (searchTerm !== '') {
            setFilteredAccounts(
                accounts.filter(account => account.username.includes(searchTerm))
            );
        } else {
            setFilteredAccounts([]);
        }
    }, [searchTerm]);

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
                                    <img src={search.image} alt={search.username}/>
                                    <div className="search-result-account-details">
                                        <p className={"search-result-username"}>{search.username}</p>
                                        <p className={"search-result-displayname"}>{search.displayName}</p>
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
                        filteredAccounts.length === 0 ? <h3 id={"no-results"}>No results found</h3> :
                        filteredAccounts.map((account, index) => (
                        <div key={index} className="search-result-account" onClick={() => {
                            if (!recentSearches.includes(account)) {
                                setRecentSearches([...recentSearches, account]);
                            }
                        }}>
                            <img src={account.image} alt={account.username}/>
                            <div className="search-result-account-details">
                                <p className={"search-result-username"}>{account.username}</p>
                                <p className={"search-result-displayname"}>{account.displayName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}