import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import { SpatialNode } from './SpatialNode';
import { FocusTimer } from './FocusTimer'; // Adapting existing component
import { useSpatialStore } from '../lib/spatial-store';

// We need to pass props from the store or parent Dashboard to the generic FocusTimer
// Since FocusTimer requires specific props, we might need to bridge them here.
// For now, I'll mock the props or assume they are passed via data. 
// In a real integration, we'd use a shared context or store for these values too.

export const FocusTimerNode = memo(({ data, selected }: NodeProps) => {
    // In a full implementation, these would come from a shared 'SessionStore' 
    // ensuring the timer state is identical between Panel and Spatial views.
    // For this MVP step, I will define a structure that assumes the 'data' prop 
    // contains the necessary handlers or state, OR strictly for visual demo,
    // we might need to duplicate state if not refactored.

    // Ideally, Dashboard logic should be lifted to a Context.
    // But to move fast, I will use the passed 'data' which we will populate in InfiniteCanvas.

    return (
        <SpatialNode selected={selected} minWidth={260} minHeight={300}>
            <div className="w-full h-full p-2">
                {/* 
            We are wrapping the existing FocusTimer.
            If data contains the props, spread them. 
         */}
                <FocusTimer
                    status={data.status}
                    elapsedSeconds={data.elapsedSeconds}
                    durationSeconds={data.durationSeconds}
                    fatigueScore={data.fatigueScore}
                    currentIntensity={data.currentIntensity}
                    onStart={data.onStart}
                    onPause={data.onPause}
                    onReset={data.onReset}
                    onIntensityChange={data.onIntensityChange}
                />
            </div>
        </SpatialNode>
    );
});

FocusTimerNode.displayName = 'FocusTimerNode';
