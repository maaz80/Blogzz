import React from 'react';

const Button = ({
    children,
    type = 'button', // Default to 'button' to prevent form submission
    bgColor = 'bg-rose-600',
    textColor = 'text-white',
    className = '',
    ...props
}) => {
    return (
        <button
            type={type} // Ensure the button type is passed here
            className={`px-4 py-1 rounded-lg ${bgColor} ${textColor} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
