import React from "react";

function button({text, onClick}) {
    return (
        <button styles={{backgroundColor: "blue", borderRadius: 100, padding: 16}} onClick={onClick}>{text}</button>
    )
}

export default button;