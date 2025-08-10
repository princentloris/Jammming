import React from "react";
import Track from "./Track.jsx";

function Tracklist({ tracks, onAction, icon = "+" }) {

    return (
        <div style={{display: "flex", flexDirection:"column", gap: 8}}>
            <h2>Results</h2>
            <div id="songsReturned" style={{display: "flex", flexDirection:"column", gap: 8}}>
                {tracks.map(track => (
                    <Track 
                        key={track.id}
                        songTitle={track.title}
                        artist={track.artist}
                        icon={icon}
                        onClick={() => onAction(track)}
                    />
                ))}
            </div>
        </div>
    )
}

export default Tracklist;