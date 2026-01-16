import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, OnNodesChange, OnEdgesChange, OnConnect } from 'reactflow';

export type SpatialViewMode = 'panel' | 'spatial';

type SpatialState = {
  // Canvas State
  nodes: Node[];
  edges: Edge[];
  viewMode: SpatialViewMode;

  // Actions
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setViewMode: (mode: SpatialViewMode) => void;
  addNode: (node: Node) => void;
};

// Initial nodes for the spatial view
const initialNodes: Node[] = [
  {
    id: 'task-list',
    type: 'taskList',
    position: { x: -450, y: 0 },
    data: { label: 'Contextual Tasks' },
  },
  {
    id: 'focus-timer',
    type: 'focusTimer',
    position: { x: 0, y: 0 },
    data: { label: 'Focus Timer' },
  },
  {
    id: 'gold-vault',
    type: 'goldVault',
    position: { x: 450, y: 0 },
    data: { label: 'Gold Vault' },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'task-list',
    target: 'focus-timer',
    type: 'custom',
    animated: true,
    style: { stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 2, strokeDasharray: '5,5' },
  },
  {
    id: 'e2-3',
    source: 'focus-timer',
    target: 'gold-vault',
    type: 'custom',
    animated: true,
    style: { stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 2, strokeDasharray: '5,5' },
  },
];

export const useSpatialStore = create<SpatialState>()(
  persist(
    (set, get) => ({
      nodes: initialNodes,
      edges: initialEdges,
      viewMode: 'spatial', // Default to spatial view

      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },

      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },

      onConnect: (connection: Connection) => {
        set({
          edges: addEdge({
            ...connection,
            type: 'custom',
            animated: true,
            style: { stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 2, strokeDasharray: '5,5' }
          }, get().edges),
        });
      },

      setViewMode: (mode) => set({ viewMode: mode }),

      addNode: (node) => set({ nodes: [...get().nodes, node] }),
    }),
    {
      name: 'ytterbium-spatial-storage-v3',
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        viewMode: state.viewMode
      }),
    }
  )
);
