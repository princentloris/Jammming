import React, { useState } from "react";
import Button from "./Button.jsx";
import Tracklist from "./Tracklist.jsx";

function Playlist({ tracks, onRemove, onSave }) {
    const [playlistName, setPlaylistName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (playlistName.trim() && tracks.length > 0) {
            onSave(playlistName);
            setPlaylistName("");
        }
    };

    return (
        <div className="playlist-container">
            <div className="playlist-header">
                <h2 className="playlist-title">Your Playlist</h2>
                <p className="playlist-subtitle">
                    {tracks.length === 0 
                        ? "Add tracks from the search results" 
                        : `${tracks.length} track${tracks.length !== 1 ? 's' : ''} in playlist`
                    }
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="playlist-form">
                <div className="playlist-input-group">
                    <label htmlFor="playlist-name" className="playlist-input-label">
                        Playlist Name
                    </label>
                    <input 
                        id="playlist-name"
                        type="text" 
                        placeholder="Enter a name for your playlist..." 
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        className="playlist-input"
                        required
                        minLength="1"
                        maxLength="100"
                    />
                </div>
                
                <div className="playlist-tracks">
                    <Tracklist 
                        tracks={tracks} 
                        onAction={onRemove} 
                        icon="-" 
                        title=""
                    />
                </div>
                
                <div className="playlist-actions">
                    <Button 
                        text="Save to Spotify" 
                        type="submit" 
                        variant="primary"
                        size="large"
                        disabled={!playlistName.trim() || tracks.length === 0}
                        className="save-playlist-btn"
                    />
                </div>
            </form>
        </div>
    );
}

export default Playlist;