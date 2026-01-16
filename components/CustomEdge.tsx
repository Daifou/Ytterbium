import React, { memo } from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';

export const CustomEdge = memo(({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    selected,
}: EdgeProps) => {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            {/* Invisible thicker path for easier interaction/hover */}
            <path
                id={id}
                style={{ strokeWidth: 20, stroke: 'transparent', fill: 'none' }}
                d={edgePath}
                className="react-flow__edge-interaction"
            />

            {/* Visible Path */}
            <path
                id={id}
                style={style}
                d={edgePath}
                markerEnd={markerEnd}
                className={`react-flow__edge-path ${selected ? 'selected' : ''}`}
            />

            {/* Animated flow effect (optional overlay) */}
            {selected && (
                <circle r="4" fill="#00F5FF">
                    <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
                </circle>
            )}
        </>
    );
});

CustomEdge.displayName = 'CustomEdge';
