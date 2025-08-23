import React, { useState } from "react";
import Button from "./Button.jsx";
import Tracklist from "./Tracklist.jsx";

function Playlist({ tracks, onRemove, onSave }) {
    const [playlistName, setPlaylistName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(playlistName);
        setPlaylistName("");
    };

    return (
        <form onSubmit={handleSubmit} style={{display: "flex", flexDirection:"column", gap: 16}}>
            <input 
                type="text" 
                placeholder="Enter playlist name" 
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
            />
            <Tracklist tracks={tracks} onAction={onRemove} icon="-" title=""/>
            <Button text="Save to Spotify" type="submit" />
        </form>
    )
}

export default Playlist;