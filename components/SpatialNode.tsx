import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import clsx from 'clsx'; // Assuming clsx is installed, based on package.json

type SpatialNodeProps = {
    children: React.ReactNode;
    selected?: boolean;
    minWidth?: number;
    minHeight?: number;
};

export const SpatialNode = memo(({ children, selected, minWidth = 280, minHeight = 320 }: SpatialNodeProps) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={clsx(
                "relative rounded-2xl transition-all duration-300 group",
                "bg-[#050505]/40 backdrop-blur-xl", // Glassmorphism base
                selected ? "node-active z-50" : "border border-white/[0.08] hover:border-white/[0.15] z-10"
            )}
            style={{ minWidth, minHeight }}
        >
            {/* Drag Handle - The "Bar" at the top */}
            <div className="custom-drag-handle absolute top-0 left-0 right-0 h-6 cursor-grab active:cursor-grabbing z-50 flex justify-center items-center group-hover:bg-white/[0.03] transition-colors rounded-t-2xl">
                <div className="w-12 h-1 bg-white/[0.1] rounded-full group-hover:bg-white/[0.2] transition-colors" />
            </div>

            {/* Input Handle (Target) - Left */}
            <Handle
                type="target"
                position={Position.Left}
                className="!bg-[#00F5FF] !w-3 !h-3 !border-2 !border-[#050505] !-left-[6px] transition-transform hover:scale-125 hover:bg-white custom-handle"
            />

            {/* Output Handle (Source) - Right */}
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-[#00F5FF] !w-3 !h-3 !border-2 !border-[#050505] !-right-[6px] transition-transform hover:scale-125 hover:bg-white custom-handle"
            />

            {/* Node Content */}
            <div className="w-full h-full pt-6"> {/* Padding top to clear drag handle */}
                {children}
            </div>

            {/* Glow Effect on Hover/Active */}
            {selected && (
                <div className="absolute inset-0 rounded-2xl bg-cyan-500/5 pointer-events-none animate-pulse" />
            )}
        </motion.div>
    );
});

SpatialNode.displayName = 'SpatialNode';
