import React, { useState } from "react";
import Track from "./Track.jsx";
import Button from "./Button.jsx";

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
                <div id="songsAdded" style={{display: "flex", flexDirection:"column", gap: 8}} > {
                    tracks.map(track => (
                        <Track 
                            key={track.id}
                            songTitle={track.title}
                            artist={track.artist}
                            icon="-"
                            onClick={() => onRemove(track)}
                        />
                        )
                    )
                }
                </div>
            <Button text="Save to Spotify" type="submit" />
        </form>
    )
}

export default Playlist;