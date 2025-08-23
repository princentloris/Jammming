import React from "react";

function Track({ uri, songTitle, artist, onClick, icon }) {
    return (
        <div className="track-card">
            <div className="track-info">
                <h3 className="track-title">{songTitle}</h3>
                <p className="track-artist">{artist}</p>
            </div>
            <button 
                className={`track-action-btn ${icon === '+' ? 'add-btn' : 'remove-btn'}`}
                onClick={onClick}
                aria-label={icon === '+' ? `Add ${songTitle} to playlist` : `Remove ${songTitle} from playlist`}
            >
                <span className="track-action-icon">{icon}</span>
            </button>
        </div>
    );
}

export default Track;