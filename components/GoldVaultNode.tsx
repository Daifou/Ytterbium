import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import { SpatialNode } from './SpatialNode';
import { GoldVault } from './GoldVault';

export const GoldVaultNode = memo(({ data, selected }: NodeProps) => {
    return (
        <SpatialNode selected={selected} minWidth={280} minHeight={300}>
            <div className="w-full h-full p-2">
                <GoldVault
                    progress={data.progress}
                    barsToday={data.barsToday}
                    totalBars={data.totalBars}
                />
            </div>
        </SpatialNode>
    );
});

GoldVaultNode.displayName = 'GoldVaultNode';
