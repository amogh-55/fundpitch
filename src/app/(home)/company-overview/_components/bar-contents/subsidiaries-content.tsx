"use client";

import { useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  NodeProps,
  ConnectionMode,
  ReactFlowInstance,
  useEdges,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import NotFound from "../not-found";

const CustomNode = ({ data, id }: NodeProps<NodeData>) => {
  const edges = useEdges();
  const isRootNode = !edges.some((edge) => edge.target === id);

  return (
    <div
      className={`${isRootNode ? "bg-[#40C3F3]" : "bg-white"} flex min-w-[300px] items-center gap-3 rounded-full border border-gray-200 px-4 py-2`}
    >
      <span className={`${isRootNode ? "text-white" : "text-gray-800"}`}>
        {data.label}
      </span>
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
}

type CustomNode = Node<NodeData>;

export default function SubsidiariesContent({ id }: { id: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const subsidiariesQuery = api.overViewProfile.getSubsidiaries.useQuery({
    id,
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

  if (!id) return <NotFound />;

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
            className="touch-none"
            proOptions={{ hideAttribution: true }}
            nodesDraggable={false}
            panOnScroll={false}
            zoomOnScroll={false}
            preventScrolling={true}
            nodesConnectable={false}
          >
            <Background />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>
      </div>
    </Card>
  );
}
