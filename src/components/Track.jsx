import React from "react";
import { useState } from "react";
import { playTrack, pauseTrack } from "../spotifyAuth";

function Track({ uri, songTitle, artist, onAddClick, icon }) {
    const [playIcon, setPlayIcon] = useState('play_circle');
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayClick = () => {
        if (isPlaying === false) {
            setPlayIcon('pause_circle');
            setIsPlaying(true);
            playTrack(uri);
        } else {
            setPlayIcon('play_circle');
            setIsPlaying(false);
            pauseTrack();
        }
    }

    return (
        <div className="track-card">
            <button 
                className="play-button"
                onClick={handlePlayClick}
                aria-label="Play track"            >
                <span className="material-symbols-outlined" style={{color: 'white'}}>
                    {playIcon}
                </span>
            </button>
            <div className="track-info">
                <h3 className="track-title">{songTitle}</h3>
                <p className="track-artist">{artist}</p>
            </div>
            <button 
                className={`track-action-btn ${icon === '+' ? 'add-btn' : 'remove-btn'}`}
                onClick={onAddClick}
                aria-label={icon === '+' ? `Add ${songTitle} to playlist` : `Remove ${songTitle} from playlist`}
            >
                <span className="track-action-icon">{icon}</span>
            </button>
        </div>
    );
}

export default Track;