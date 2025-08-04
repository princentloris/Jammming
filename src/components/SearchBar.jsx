import React, { useState } from "react";
import Button from "./Button.jsx";

function SearchBar({ onSearch}) {
    const [userInput, setUserInput] = useState("");

    const handleChange = (e) => {
        setUserInput(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(userInput);
        setUserInput("");
    }

    return (
        <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "row"}}>
            <input type="text" value={userInput} onChange={handleChange} placeholder="Find a song" />
            <Button type="submit" onClick={handleSubmit} text="Search"/>
        </form>
    )
}

export default SearchBar;

