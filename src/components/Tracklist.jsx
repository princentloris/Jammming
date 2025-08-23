import React from "react";
import Track from "./Track.jsx";

function Tracklist({ tracks, onAction, icon = "+", title = "Results" }) {
    return (
        <div className="tracklist-container">
            <div className="tracklist-header">
                <h2 className="tracklist-title">{title}</h2>
                <p className="tracklist-subtitle">
                    {tracks.length === 0 
                        ? "Search for tracks to get started" 
                        : `${tracks.length} track${tracks.length !== 1 ? 's' : ''} found`
                    }
                </p>
            </div>
            
            <div className="tracklist-content">
                {tracks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🎵</div>
                        <p className="empty-state-text">No tracks to display</p>
                        <p className="empty-state-subtext">Use the search bar above to find music</p>
                    </div>
                ) : (
                    tracks.map(track => (
                        <Track 
                            key={track.id}
                            songTitle={track.title}
                            artist={track.artist}
                            icon={icon}
                            onClick={() => onAction(track)}
                            uri={track.uri}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default Tracklist;