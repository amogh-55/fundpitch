"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  Panel as FlowPanel,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  NodeProps,
  ConnectionMode,
  PanelPosition,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import NotFound from "../not-found";

interface CustomNodeData {
  label: string;
  onAddNode: (id: string) => void;
  onLabelChange: (id: string, label: string) => void;
  onDelete: (id: string) => void;
}

const CustomNode = ({ data, id }: NodeProps<CustomNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    data.onLabelChange(id, label);
  };

  const handleAddChild = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (data.onAddNode) {
      data.onAddNode(id);
    }
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <div className="flex min-w-[300px] items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2">
      <button
        type="button"
        className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-400 text-white hover:bg-blue-500"
        onClick={handleAddChild}
      >
        <Plus size={16} />
      </button>
      {isEditing ? (
        <Input
          autoFocus
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === "Enter" && handleBlur()}
          className="min-w-[200px]"
        />
      ) : (
        <span
          className="cursor-pointer text-gray-800"
          onDoubleClick={handleDoubleClick}
        >
          {label}
        </span>
      )}
      <button
        type="button"
        className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-red-400 text-white hover:bg-red-500"
        onClick={handleDelete}
      >
        <X size={16} />
      </button>
      <Handle
        type="target"
        position={Position.Top}
        className="h-2 w-2 !bg-blue-400"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="h-2 w-2 !bg-blue-400"
      />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

interface NodeData {
  label: string;
  onAddNode: (id: string) => void;
  onLabelChange: (id: string, label: string) => void;
  onDelete: (id: string) => void;
}

type CustomNode = Node<NodeData>;

interface PanelProps {
  children: React.ReactNode;
  className?: string;
}

const Panel = ({ children, className }: PanelProps) => {
  return (
    <div
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform ${className}`}
    >
      {children}
    </div>
  );
};

export default function InviteJourneyContent({ id }: { id: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const nodeIdCounter = useRef(2); // Start from 2 since root is 1
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  // Reset counter when component mounts
  useEffect(() => {
    nodeIdCounter.current = 2; // Reset to 2

    if (nodes.length === 0) {
      const initialNode: Node<NodeData> = {
        id: "node-1", // Root node is always 1
        type: "custom",
        position: { x: window.innerWidth / 2 - 150, y: 50 },
        data: {
          label: "Entity 1",
          onAddNode: handleAddNode,
          onLabelChange: handleLabelChange,
          onDelete: handleDelete,
        },
      };
      setNodes([initialNode]);
    }
  }, []);

  const handleAddNode = useCallback(
    (parentId?: string) => {
      const newNodeId = `node-${nodeIdCounter.current}`;
      const currentCount = nodeIdCounter.current;
      nodeIdCounter.current += 1;

      const parentNode = parentId
        ? nodes.find((node) => node.id === parentId)
        : null;

      // Calculate position based on existing children
      const existingChildren = parentNode
        ? nodes.filter((node) =>
            edges.some(
              (edge) => edge.source === parentId && edge.target === node.id,
            ),
          )
        : [];

      const position = parentNode
        ? {
            x:
              parentNode.position.x +
              (existingChildren.length * 350 -
                (350 * (existingChildren.length - 1)) / 2),
            y: parentNode.position.y + 150, // Reduced vertical spacing
          }
        : { x: window.innerWidth / 2 - 150, y: 50 };

      const newNode: Node<NodeData> = {
        id: newNodeId,
        type: "custom",
        position,
        data: {
          label: `Entity ${currentCount}`,
          onAddNode: handleAddNode,
          onLabelChange: handleLabelChange,
          onDelete: handleDelete,
        },
      };

      setNodes((nds) => [...nds, newNode]);

      if (parentId) {
        const newEdge: Edge = {
          id: `e-${parentId}-${newNodeId}`,
          source: parentId,
          target: newNodeId,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#60a5fa" },
        };
        setEdges((eds) => [...eds, newEdge]);

        // Now TypeScript knows reactFlowInstance can be null
        setTimeout(() => {
          if (reactFlowInstance) {
            reactFlowInstance.fitView({ padding: 0.5, duration: 200 });
          }
        }, 50);
      }
    },
    [nodes, edges, reactFlowInstance],
  );

  const handleLabelChange = useCallback(
    (nodeId: string, newLabel: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                label: newLabel,
                onAddNode: handleAddNode,
                onLabelChange: handleLabelChange,
              },
            };
          }
          return node;
        }),
      );
    },
    [handleAddNode, setNodes],
  );

  const handleDelete = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));

      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      );
    },
    [setNodes, setEdges],
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => [
        ...eds,
        {
          ...params,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#60a5fa" },
          label: "Subsidiary",
          labelStyle: { fill: "#666", fontSize: 12 },
          markerEnd: { type: "arrowclosed" },
        } as Edge,
      ]);
    },
    [setEdges],
  );

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  }, []);

  if (!id) return <NotFound />;

  return (
    <Card className="relative rounded-t-[46px] bg-white">
      <div className="absolute left-0 top-0 flex h-24 w-full items-center rounded-t-[45px] bg-[#40C3F3] px-4">
        <h2 className="relative bottom-5 left-10 flex font-normal text-white">
          Invite Journey
        </h2>
      </div>
      <div className="absolute top-14 w-full rounded-t-[45px] bg-white p-14 pt-8">
        <div className="relative h-[400px] w-full overflow-auto rounded-lg bg-white">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{
              padding: 0.5,
              minZoom: 0.5,
              maxZoom: 1.5,
            }}
            minZoom={0.5}
            maxZoom={1.5}
            proOptions={{ hideAttribution: true }}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            connectionMode={ConnectionMode.Loose}
            deleteKeyCode={["Backspace", "Delete"]}
            className="touch-none"
            onInit={onInit}
          >
            <Background />
            <Controls />
            {nodes.length === 0 && (
              <FlowPanel
                position={"top-center" as const}
                className="rounded-lg bg-white p-4 shadow-md"
              >
                <button
                  type="button"
                  onClick={() => handleAddNode()}
                  className="flex items-center gap-2 rounded-md bg-blue-400 px-4 py-2 text-white hover:bg-blue-500"
                >
                  <Plus size={16} />
                  Add First Entity
                </button>
              </FlowPanel>
            )}
          </ReactFlow>
        </div>
      </div>
    </Card>
  );
}
