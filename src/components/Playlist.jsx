import React from "react";
import Track from "./Track.jsx";
import Button from "./Button.jsx";

function Playlist({ tracks, onRemove, onSave }) {
    return (
        <form onSubmit={onSave} style={{display: "flex", flexDirection:"column", gap: 16}}>

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
            <Button text="Save to Spotify" onClick={onSave} type="submit" />
        </form>
    )
}

export default Playlist;