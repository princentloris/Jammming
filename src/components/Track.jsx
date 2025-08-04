import React from "react";

function Track({songTitle, artist, onClick, icon}) {

    return (
        <div style={{display:"flex", flexDirection:"row"}}>
            <div style={{display:"flex", flexDirection:"column"}}>
                <p>{songTitle}</p>
                <p>{artist}</p>
            </div>
            <button style={{padding: 8}} onClick={onClick}>{icon}</button>
        </div>
    )
}

export default Track;