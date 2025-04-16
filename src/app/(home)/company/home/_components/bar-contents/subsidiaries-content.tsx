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
  useEdges,
} from "reactflow";
import "reactflow/dist/style.css";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { v4 as uuidv4 } from "uuid";

const CustomNode = ({ data, id }: NodeProps<NodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState<string>(data.label);

  const edges = useEdges();

  const isRootNode = !edges.some((edge) => edge.target === id);

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
    data.onAddNode(id);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <div
      className={`${isRootNode ? "bg-[#40C3F3]" : "bg-white"} flex min-w-[300px] items-center gap-3 rounded-full border border-gray-200 px-4 py-2`}
    >
      <button
        type="button"
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          isRootNode
            ? "bg-white text-[#40C3F3] hover:bg-gray-100"
            : "bg-blue-400 text-white hover:bg-blue-500"
        }`}
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
          className={`cursor-pointer ${isRootNode ? "text-white" : "text-gray-800"}`}
          onDoubleClick={handleDoubleClick}
        >
          {label}
        </span>
      )}
      <button
        type="button"
        className={`ml-auto flex h-6 w-6 items-center justify-center rounded-full ${
          isRootNode
            ? "bg-white text-red-400 hover:bg-gray-100"
            : "bg-red-400 text-white hover:bg-red-500"
        }`}
        onClick={handleDelete}
      >
        <X size={16} />
      </button>
      <Handle
        type="target"
        position={Position.Top}
        className={`h-2 w-2 ${isRootNode ? "!bg-white" : "!bg-blue-400"}`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={`h-2 w-2 ${isRootNode ? "!bg-white" : "!bg-blue-400"}`}
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

export default function SubsidiariesContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);
  const [usedNodeIds, setUsedNodeIds] = useState<string[]>([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const utils = api.useUtils();
  const subsidiariesQuery = api.company.getSubsidiaries.useQuery();
  const addSubsidiaryMutation = api.company.addSubsidiary.useMutation({
    onMutate: ({ nodeId, label, parentId, position }) => {
      const newNode: Node<NodeData> = {
        id: nodeId,
        type: "custom",
        position,
        data: {
          label,
          onAddNode: handleAddNode,
          onLabelChange: handleLabelChange,
          onDelete: handleDelete,
        },
      };
      setNodes((nds) => [...nds, newNode]);

      if (parentId) {
        const newEdge: Edge = {
          id: `e-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#60a5fa" },
        };
        setEdges((eds) => [...eds, newEdge]);
      }
    },
    onError: () => {
      void utils.company.getSubsidiaries.invalidate();
    },
  });
  const updateLabelMutation = api.company.updateSubsidiaryLabel.useMutation({
    onMutate: ({ nodeId, label }) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, label } }
            : node,
        ),
      );
    },
    onError: () => {
      void utils.company.getSubsidiaries.invalidate();
    },
  });
  const deleteSubsidiaryMutation = api.company.deleteSubsidiary.useMutation({
    onMutate: ({ nodeId }) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      );
    },
    onError: () => {
      void utils.company.getSubsidiaries.invalidate();
    },
  });

  useEffect(() => {
    if (subsidiariesQuery.data) {
      const dbNodes = subsidiariesQuery.data.map(
        (sub): Node<NodeData> => ({
          id: sub.nodeId,
          type: "custom",
          position: sub.position,
          data: {
            label: sub.label,
            onAddNode: handleAddNode,
            onLabelChange: handleLabelChange,
            onDelete: handleDelete,
          },
        }),
      );

      const dbEdges = subsidiariesQuery.data
        .filter((sub) => sub.parentId)
        .map((sub, index) => {
          const childrenOfParent = subsidiariesQuery.data
            .filter((node) => node.parentId === sub.parentId)
            .indexOf(sub);

          return {
            id: `e-${sub.parentId}-${sub.nodeId}-child-${childrenOfParent + 1}`,
            source: sub.parentId!,
            target: sub.nodeId,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#60a5fa" },
          };
        });

      setNodes(dbNodes);
      setEdges(dbEdges);
    }
  }, [subsidiariesQuery.data]);

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const getHighestEntityNumber = (nodesList: Node[]) => {
    const numberPattern = /\d+/;
    return Math.max(
      ...nodesList.map((node) => {
        const match = numberPattern.exec(node.id);
        return match ? parseInt(match[0], 10) : 0;
      }),
      0,
    );
  };

  const handleAddNode = useCallback(
    (parentId?: string) => {
      console.log("=== Adding New Node ===");
      console.log("Current nodes:", nodes);
      console.log("Parent ID:", parentId);
      console.log("Used Node IDs:", Array.from(usedNodeIds));
      console.log("Edges:", edges);
      const nextNumber = getHighestEntityNumber(nodes) + 1;
      const newNodeId = uuidv4();

      if (nodes.some((node) => node.id === newNodeId)) {
        console.warn("Node already exists:", newNodeId);
        return;
      }

      const position = parentId
        ? (() => {
            const parentNode = nodes.find((n) => n.id === parentId);
            if (!parentNode) return { x: 0, y: 0 };

            const siblings = nodes.filter((node) =>
              edges.some(
                (edge) => edge.source === parentId && edge.target === node.id,
              ),
            );

            // Find the index of current node among siblings
            const currentIndex = siblings.findIndex(
              (node) => node.id === newNodeId,
            );

            return {
              x: parentNode.position.x + (currentIndex + 1) * 300, // Use index for x position
              y: parentNode.position.y + 150,
            };
          })()
        : { x: window.innerWidth / 2 - 150, y: 50 };
      // ... existing code ...

      const newNode: Node<NodeData> = {
        id: newNodeId,
        type: "custom",
        position,
        data: {
          label: `Add your entity here`,
          onAddNode: handleAddNode,
          onLabelChange: handleLabelChange,
          onDelete: handleDelete,
        },
      };

      setNodes((nds) => [...nds, newNode]);

      if (parentId) {
        const newEdge: Edge = {
          id: generateUniqueId(),
          source: parentId,
          target: newNodeId,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#60a5fa" },
        };
        setEdges((eds) => [...eds, newEdge]);
      }

      addSubsidiaryMutation.mutate({
        nodeId: newNodeId,
        label: `Entity`,
        parentId,
        position,
      });
    },
    [nodes, edges],
  );

  const handleLabelChange = useCallback(
    (nodeId: string, newLabel: string) => {
      updateLabelMutation.mutate({
        nodeId,
        label: newLabel,
      });
    },
    [updateLabelMutation],
  );

  const handleDelete = useCallback(
    (nodeId: string) => {
      deleteSubsidiaryMutation.mutate({ nodeId });
    },
    [deleteSubsidiaryMutation],
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

  return (
    <Card className="relative rounded-t-[46px] bg-white shadow-none">
      <div className="absolute left-0 top-0 flex h-24 w-full items-center rounded-t-[45px] bg-[#40C3F3] px-4">
        <h2 className="relative bottom-5 left-10 flex font-normal text-white">
          Subsidiaries
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
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            connectionMode={ConnectionMode.Loose}
            deleteKeyCode={["Backspace", "Delete"]}
            className="touch-none"
            onInit={onInit}
            proOptions={{ hideAttribution: true }}
            nodesDraggable={true}
            panOnScroll={false}
          >
            <Background />
            <Controls />
            {!subsidiariesQuery.isLoading &&
              subsidiariesQuery.data?.length === 0 &&
              nodes.length === 0 && (
                <FlowPanel
                  position={"top-center" as const}
                  className="rounded-lg bg-white p-4 shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => handleAddNode()}
                    className="flex items-center gap-2 rounded-md bg-[#40C3F3] px-4 py-2 text-white hover:bg-blue-500"
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
