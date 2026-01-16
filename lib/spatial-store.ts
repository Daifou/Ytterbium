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
    id: 'focus-timer',
    type: 'focusTimer',
    position: { x: 0, y: 0 },
    data: { label: 'Focus Timer' },
  },
  {
    id: 'task-list',
    type: 'taskList',
    position: { x: 400, y: 0 },
    data: { label: 'Contextual Tasks' },
  },
  {
    id: 'gold-vault',
    type: 'goldVault',
    position: { x: 0, y: 400 },
    data: { label: 'Gold Vault' },
  },
];

const initialEdges: Edge[] = [];

export const useSpatialStore = create<SpatialState>()(
  persist(
    (set, get) => ({
      nodes: initialNodes,
      edges: initialEdges,
      viewMode: 'panel', // Default to panel view initially

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
      name: 'ytterbium-spatial-storage',
      partialize: (state) => ({ 
        nodes: state.nodes, 
        edges: state.edges,
        viewMode: state.viewMode 
      }),
    }
  )
);
