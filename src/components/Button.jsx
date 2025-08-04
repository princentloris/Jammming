import React from "react";

function Button({text, onClick, type}) {
    return (
        <button 
            type={type}
            style={{backgroundColor: "blue", borderRadius: 100, padding: 16}} 
            onClick={onClick}
        >
            {text}
        </button>
    )
}

export default Button;