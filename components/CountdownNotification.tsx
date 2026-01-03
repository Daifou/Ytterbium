import React from 'react';
import { motion } from 'framer-motion';
import { MacNotification } from './MacNotification';

interface CountdownNotificationProps {
    countdown: number;
}

export const CountdownNotification: React.FC<CountdownNotificationProps> = ({ countdown }) => {
    return (
        <MacNotification
            isVisible={true}
            title="Focus Portal"
            message={`Initializing environment in ${countdown} seconds...`}
            icon={
                <div className="w-5 h-5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse" />
            }
        />
    );
};
