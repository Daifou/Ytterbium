import React, { memo } from 'react';
import { NodeProps } from 'reactflow';
import { SpatialNode } from './SpatialNode';
import { TaskList } from './TaskList';

export const TaskListNode = memo(({ data, selected }: NodeProps) => {
    return (
        <SpatialNode selected={selected} minWidth={300} minHeight={400}>
            <div className="w-full h-full p-2">
                <TaskList
                    tasks={data.tasks || []}
                    onToggle={data.onToggle || (() => { })}
                    onAdd={data.onAdd || (() => { })}
                    onDelete={data.onDelete}
                />
            </div>
        </SpatialNode>
    );
});

TaskListNode.displayName = 'TaskListNode';
