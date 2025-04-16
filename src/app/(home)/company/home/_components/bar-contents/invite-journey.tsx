"use client";

import { useState, useCallback, useEffect } from "react";
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
  MarkerType,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { Eye, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
// Define types
interface InviteNode {
  id: string;
  name: string;
  logo?: string | null;
  individualPhoto?: string | null;
  companyPhoto?: string | null;
  inviteId?: string;
  phoneNumber?: string;
  userId?: string;
  role?: string;
  type: "company" | "user";
  parentId?: string;
  status?: string;
}

type CustomNodeData = InviteNode;

const USER_TYPES = [
  {
    name: "Merchant Banker",
    type: "merchant-banker",
    image: "/assets/images/banker.png",
  },
  {
    name: "Investors",
    type: "investors",
    image: "/assets/images/investor.png",
  },
  {
    name: "Advisor / SME",
    type: "advisor/SME",
    image: "/assets/images/advisor.png",
  },
  {
    name: "Service Provider",
    type: "serice/provider",
    image: "/assets/images/service.png",
  },
  {
    name: "Product / Service Clients",
    type: "product&service",
    image: "/assets/images/productservice.png",
  },
  { name: "Others", type: "others", image: "/assets/images/others.png" },
];

const CustomNode = ({ data }: NodeProps<CustomNodeData>) => {
  console.log({ data });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");

  const { data: userTypeData } = api.user.getUserTypeChangeCount.useQuery(
    { userId: data.userId! },
    { enabled: data.type === "user" },
  );

  const utils = api.useUtils();

  const { mutate: updateUserType } = api.user.updateUserType.useMutation({
    onSuccess: () => {
      toast({
        title: "User type updated successfully",
      });
      void utils.company.getInviteJourney.invalidate();
      void utils.user.getUserTypeChangeCount.invalidate();
      void utils.user.getUserTypeChangeCount.refetch();
    },
    onError: (error) => {
      toast({
        title: "Error updating user type",
        description: error.message,
      });
    },
  });

  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    const changeCount = userTypeData?.typeChangeCount ?? 0;

    if (userTypeData?.pendingRequest) {
      toast({
        title: "You already have a pending request for type change",
      });
      return;
    }

    updateUserType(
      {
        userId: data.id,
        newType: selectedType,
        name: data.name,
        changeCount: changeCount + 1,
        currentType: userTypeData?.currentType ?? "",
        phoneNumber: data.phoneNumber!,
      },
      {
        onSuccess: (response) => {
          if (response.requiresApproval) {
            toast({
              title: "Request submitted for admin approval",
            });
          } else {
            toast({
              title: "User type updated successfully",
            });
          }
          void utils.company.getInviteJourney.invalidate();
        },
      },
    );

    setShowConfirmDialog(false);
  };

  if (data.type === "company") {
    return (
      <div className="relative w-[250px] rounded-lg bg-white p-4 shadow-md">
        <div className="flex flex-col items-center gap-3">
          <img
            src={
              data.logo === ""
                ? "/assets/images/companylogo.png"
                : (data.logo ?? "/assets/images/companylogo.png")
            }
            alt={data.name ?? ""}
            className="h-16 w-16 rounded-lg object-cover"
          />
          <div className="text-center">
            <div className="text-base font-semibold text-gray-800">
              {data.name}
            </div>
            <div className="text-xs text-gray-500">you</div>
          </div>
        </div>

        <Handle type="source" position={Position.Bottom} />
      </div>
    );
  }

  // User node layout
  return (
    <>
      <div className="relative w-[250px] rounded-lg bg-white p-4 shadow-md">
        <div className="flex items-center gap-3">
          <img
            src={data.logo ?? "/assets/images/profile.png"}
            alt={data.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800">{data.name}</div>
            <Select onValueChange={handleTypeChange}>
              <SelectTrigger className="mt-1 h-7 w-full text-xs">
                <SelectValue placeholder={data.role ?? "Select Type"} />
              </SelectTrigger>
              <SelectContent>
                {USER_TYPES.map((type) => (
                  <SelectItem key={type.name} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          variant="ghost"
          className="absolute right-2 top-2"
          onClick={() => {
            window.open(`/individual-overview?id=${data.id}`, "_blank");
          }}
        >
          <Eye className="h-5 w-5 text-gray-400" />
        </Button>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />

        {/* Show pending request status if exists */}
        {userTypeData?.pendingRequest && (
          <div className="mt-1 text-xs text-amber-600">
            Type change pending approval
          </div>
        )}
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Type</AlertDialogTitle>
            <AlertDialogDescription>
              {userTypeData?.typeChangeCount &&
              userTypeData.typeChangeCount &&
              userTypeData.typeChangeCount >= 3 ? (
                <>
                  You&apos;ve exceeded the direct change limit. This request
                  will need admin approval.
                  <p className="mt-2 text-sm font-medium text-amber-600">
                    Current Type: {userTypeData.currentType}
                    <br />
                    Requested Type: {selectedType}
                  </p>
                </>
              ) : (
                <>
                  Are you sure you want to change the user type? This action can
                  only be performed 3 times.
                  <p className="mt-2 text-sm font-medium text-gray-600">
                    Changes remaining:{" "}
                    {Math.max(0, 3 - (userTypeData?.typeChangeCount ?? 0))}
                  </p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {userTypeData?.typeChangeCount &&
              userTypeData.typeChangeCount >= 3
                ? "Submit Request"
                : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export default function InviteJourneyContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const { data: inviteJourney, isLoading } =
    api.company.getInviteJourney.useQuery();

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => [
        ...eds,
        {
          ...params,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#60a5fa" },
        } as Edge,
      ]);
    },
    [setEdges],
  );

  useEffect(() => {
    if (!inviteJourney) return;

    const { company, invites } = inviteJourney;
    console.log("invites", invites);
    const newNodes: Node<CustomNodeData>[] = [];
    const newEdges: Edge[] = [];

    // Constants for layout
    const LEVEL_HEIGHT = 200; // Vertical spacing between levels
    const NODE_WIDTH = 350; // Horizontal spacing between nodes
    const LEVEL_INDENT = 150; // Horizontal indent for each level
    const START_Y = 50; // Starting Y position
    const START_X = 50; // Starting X position

    // Create company node at the start
    const companyNode: Node<CustomNodeData> = {
      id: company?.id ?? "",
      type: "custom",
      position: { x: START_X, y: START_Y },
      data: {
        id: company?.id ?? "",
        name: company?.name ?? "",
        logo: company?.logo ?? "",
        type: "company",
      },
    };
    newNodes.push(companyNode);

    // Group invites by level
    const levelGroups = new Map<number, typeof invites>();
    invites.forEach((invite) => {
      const level = invite.inviteLevel ?? 0;
      if (!levelGroups.has(level)) {
        levelGroups.set(level, []);
      }
      levelGroups.get(level)?.push(invite);
    });

    // Track used positions for each level
    const usedPositions = new Map<number, number[]>();

    // Process each level
    Array.from(levelGroups.keys())
      .sort((a, b) => a - b)
      .forEach((level) => {
        const levelInvites = levelGroups.get(level) ?? [];
        usedPositions.set(level, []);

        levelInvites.forEach((invite) => {
          const nodeId = invite.userId!;

          console.log({ nodeId });
          const inviterId = invite.inviterId;

          // Find parent node position if exists
          let parentX = START_X;
          if (inviterId) {
            const parentNode = newNodes.find((n) => n.id === inviterId);
            if (parentNode) {
              parentX = parentNode.position.x;
            }
          }

          // Calculate position
          const usedXPositions = usedPositions.get(level) ?? [];
          let xPos = parentX + LEVEL_INDENT;

          // Ensure minimum spacing between nodes at the same level
          while (usedXPositions.some((x) => Math.abs(x - xPos) < NODE_WIDTH)) {
            xPos += NODE_WIDTH;
          }
          usedXPositions.push(xPos);
          usedPositions.set(level, usedXPositions);

          const node: Node<CustomNodeData> = {
            id: nodeId,
            type: "custom",
            position: {
              x: xPos,
              y: START_Y + level * LEVEL_HEIGHT,
            },
            data: {
              id: nodeId,
              userId: invite.userId!,
              name: invite.userName ?? invite.email ?? invite.phone ?? "",
              logo: invite.userPhoto,
              phoneNumber: invite.phone!,
              role: invite.role,
              type: "user",
              status: invite.status,
              inviteId: invite.inviteId,
            },
          };
          console.log({ node });
          newNodes.push(node);

          // Create edge if there's a parent
          if (inviterId) {
            const edge: Edge = {
              id: `e-${inviterId}-${nodeId}`,
              source: inviterId,
              target: nodeId,
              type: "smoothstep",
              animated: true,
              style: { stroke: "#60a5fa" },
              label: invite.status || "invited",
              labelStyle: { fill: "#666", fontSize: 12 },
              labelBgStyle: { fill: "white", fillOpacity: 0.8 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: "#60a5fa",
              },
            };
            newEdges.push(edge);
          }
        });
      });

    setNodes(newNodes);
    setEdges(newEdges);

    // Fit view
    setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.setViewport({
          x: 0,
          y: 0,
          zoom: 0.7,
        });
        reactFlowInstance.fitView({
          padding: 0.2,
          minZoom: 0.4,
          maxZoom: 1,
        });
      }
    }, 100);
  }, [inviteJourney, reactFlowInstance]);

  if (isLoading) {
    return (
      <Card className="relative rounded-t-[46px] bg-white">
        <div className="flex h-[500px] items-center justify-center">
          Loading...
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative rounded-t-[46px] bg-white">
      <div className="absolute left-0 top-0 flex h-24 w-full items-center rounded-t-[45px] bg-[#40C3F3] px-4">
        <h2 className="relative bottom-5 left-10 flex font-normal text-white">
          Invite Journey
        </h2>
      </div>
      <div className="absolute top-14 w-full rounded-t-[45px] bg-white p-14 pt-8">
        <div className="relative h-[500px] w-full rounded-lg bg-white">
          {" "}
          {/* Increased height */}
          <div className="absolute inset-0 overflow-x-auto overflow-y-hidden">
            <div className="h-full min-w-full">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{
                  padding: 0.2,
                  minZoom: 0.4,
                  maxZoom: 1,
                }}
                minZoom={0.5}
                maxZoom={1.2}
                proOptions={{ hideAttribution: true }}
                defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
                connectionMode={ConnectionMode.Loose}
                className="h-full"
                style={{ background: "transparent" }}
              >
                <Background gap={20} />
                <Controls />
                {nodes.length === 0 && (
                  <FlowPanel
                    position="top-center"
                    className="rounded-lg bg-white p-4 shadow-md"
                  >
                    <div className="text-center text-gray-500">
                      No invite journey data available
                    </div>
                  </FlowPanel>
                )}
              </ReactFlow>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
