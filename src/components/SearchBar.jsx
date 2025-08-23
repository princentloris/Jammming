import React, { useState } from "react";
import Button from "./Button.jsx";

function SearchBar({ onSearch }) {
    const [userInput, setUserInput] = useState("");

    const handleChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userInput.trim()) {
            onSearch(userInput);
            setUserInput("");
        }
    };

    return (
        <div className="search-container">
            <div className="search-header">
                <h2 className="search-title">Discover Music</h2>
                <p className="search-subtitle">Search for your favorite tracks and add them to your playlist</p>
            </div>
            
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-input-wrapper">
                    <input 
                        type="text" 
                        value={userInput} 
                        onChange={handleChange} 
                        placeholder="Search for a song, artist, or album..." 
                        className="search-input"
                        aria-label="Search for music"
                    />
                    <Button 
                        type="submit" 
                        text="Search"
                        variant="primary"
                        size="large"
                        disabled={!userInput.trim()}
                        className="search-button"
                    />
                </div>
            </form>
        </div>
    );
}

export default SearchBar;

