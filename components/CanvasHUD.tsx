import React from 'react';
import { motion } from 'framer-motion';
import { Image, Type, Bot, Plus } from 'lucide-react';
import { useSpatialStore } from '../lib/spatial-store';

export const CanvasHUD: React.FC = () => {
    const addNode = useSpatialStore(state => state.addNode);

    const handleAddNode = (type: string) => {
        const id = `${type}-${Date.now()}`;
        // Simple random position around center for now
        const position = {
            x: 200 + Math.random() * 100,
            y: 200 + Math.random() * 100
        };

        // In a real app, we'd spawn at the viewport center
        addNode({
            id,
            type: 'default', // Using default for now as we haven't made Image/Text nodes yet
            position,
            data: { label: `New ${type}` },
        });
    };

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
            <div className="
                flex items-center gap-2 p-2 
                bg-[#0f0f12]/80 backdrop-blur-xl 
                border border-white/[0.08] rounded-2xl 
                shadow-[0_8px_32px_rgba(0,0,0,0.5)]
            ">
                <HUDButton
                    icon={Image}
                    label="Add Image"
                    onClick={() => handleAddNode('Image')}
                />
                <div className="w-[1px] h-8 bg-white/[0.1] mx-1" />
                <HUDButton
                    icon={Type}
                    label="Add Text"
                    onClick={() => handleAddNode('Text')}
                />
                <div className="w-[1px] h-8 bg-white/[0.1] mx-1" />
                <HUDButton
                    icon={Bot}
                    label="Generate"
                    highlight
                    onClick={() => handleAddNode('AI')}
                />
            </div>
        </motion.div>
    );
};

interface HUDButtonProps {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    highlight?: boolean;
}

const HUDButton: React.FC<HUDButtonProps> = ({ icon: Icon, label, onClick, highlight }) => {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200
                ${highlight
                    ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 hover:from-indigo-500/30 hover:to-cyan-500/30 text-cyan-400 border border-cyan-500/20'
                    : 'hover:bg-white/[0.05] text-gray-400 hover:text-white border border-transparent'
                }
            `}
        >
            <Icon className="w-4 h-4" />
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
};
