import React from "react";
import Track from "./Track.jsx";

function Tracklist({ tracks, onAction, icon = "+", title = "Results" }) {

    return (
        <div style={{display: "flex", flexDirection:"column", gap: 8}}>
            <h2>{title}</h2>
            <div id="songsReturned" style={{display: "flex", flexDirection:"column", gap: 8}}>
                {tracks.map(track => (
                    <Track 
                        key={track.id}
                        songTitle={track.title}
                        artist={track.artist}
                        icon={icon}
                        onClick={() => onAction(track)}
                        uri={track.uri}
                    />
                ))}
            </div>
        </div>
    )
}

export default Tracklist;