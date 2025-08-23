import React from "react";

function Button({ text, onClick, type = "button", variant = "primary", size = "medium", disabled = false, className = "" }) {
    const baseClasses = "btn";
    const variantClasses = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        outline: "btn-outline",
        ghost: "btn-ghost"
    };
    const sizeClasses = {
        small: "btn-sm",
        medium: "btn-md",
        large: "btn-lg"
    };
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();
    
    return (
        <button 
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled}
            aria-label={text}
        >
            <span className="btn-content">{text}</span>
        </button>
    );
}

export default Button;