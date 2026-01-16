import React, { useCallback, useRef, useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    ReactFlowProvider,
    BackgroundVariant,
    Panel,
    useReactFlow,
} from 'reactflow';
import { useSpatialStore } from '../lib/spatial-store';
import { motion, AnimatePresence } from 'framer-motion';

import { SpatialNode } from './SpatialNode';
import { CustomEdge } from './CustomEdge';
import { FocusTimerNode } from './FocusTimerNode';
import { TaskListNode } from './TaskListNode';
import { GoldVaultNode } from './GoldVaultNode';

type InfiniteCanvasProps = {
    children?: React.ReactNode;
};

const InfiniteCanvasContent: React.FC<InfiniteCanvasProps> = ({ children }) => {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
    } = useSpatialStore();

    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    // Define node types here (mapped to components)
    const nodeTypes = useMemo(() => ({
        focusTimer: FocusTimerNode,
        taskList: TaskListNode,
        goldVault: GoldVaultNode,
    }), []);

    // Custom edge types
    const edgeTypes = useMemo(() => ({
        custom: CustomEdge,
    }), []);

    return (
        <div className="w-full h-screen bg-[#050505]" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes as any}
                edgeTypes={edgeTypes as any}
                fitView
                className="spatial-canvas"
                minZoom={0.5}
                maxZoom={2}
                defaultEdgeOptions={{
                    type: 'default',
                    animated: true,
                    style: { stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 2, strokeDasharray: '5,5' },
                }}
                proOptions={{ hideAttribution: true }}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="rgba(255, 255, 255, 0.1)"
                />
                <Controls className="!bg-[#111] !border-[#222] !fill-white [&>button]:!border-b-[#222] hover:[&>button]:!bg-[#222]" />

                {/* HUD Overlay could go here or outside */}
                {children}
            </ReactFlow>
        </div>
    );
};

export const InfiniteCanvas: React.FC<InfiniteCanvasProps> = (props) => {
    return (
        <ReactFlowProvider>
            <InfiniteCanvasContent {...props} />
        </ReactFlowProvider>
    );
};
