import React from 'react';

interface LogoProps {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-6 h-6" }) => {
    return (
        <img
            src="/logo.svg"
            alt="Ytterbium Logo"
            className={className}
            style={{ filter: 'brightness(0) invert(1)' }}
        />
    );
};
