import React from 'react';

interface LogoProps {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-6 h-6" }) => {
    return (
        <img
            src="/logo.png"
            alt="Ytterbium"
            className={`${className} object-contain`}
            draggable={false}
        />
    );
};
