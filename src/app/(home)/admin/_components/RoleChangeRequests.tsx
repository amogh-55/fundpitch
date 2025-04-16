"use client";
import { api, RouterOutputs } from "@/trpc/react";
import { toast, useToast } from "@/components/ui/use-toast";
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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowRightIcon, Ellipsis } from "lucide-react";
import { UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const RoleChangeCard = ({
  request,
}: {
  request: RouterOutputs["admin"]["getPendingRoleChangeRequests"][0];
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [action, setAction] = useState<"approved" | "rejected">("approved");
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const router = useRouter();

  const utils = api.useContext();

  const { mutate: handleRequest } =
    api.admin.handleRoleChangeRequest.useMutation({
      onSuccess: () => {
        toast({
          title: `Request ${action} successfully`,
        });
        void utils.admin.getRoleChangeRequests.invalidate();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
        });
      },
    });

  const handleAction = (status: "approved" | "rejected") => {
    setAction(status);
    setShowConfirmDialog(true);
  };

  const confirmAction = () => {
    handleRequest({
      requestId: request.id,
      status: action,
    });
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div className="relative flex flex-col items-center space-y-8 rounded-lg bg-white p-4 shadow-md">
        {/* Menu Icon and Popover */}

        <Popover>
          <PopoverTrigger className="absolute right-2 top-2 cursor-pointer">
            <Ellipsis className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </PopoverTrigger>
          <PopoverContent className="">
            <div className="flex flex-col space-y-2 p-2">
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  router.push(`/admin/company-view?id=${request.madeBy}`);
                }}
              >
                View Company Profile
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  router.push(`/admin/individual-view?id=${request.userId}`);
                }}
              >
                View Individual Profile
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Top Section */}
        <div className="flex items-center space-x-6">
          <img
            src={request.companyLogo ?? "/assets/images/companylogo.png"}
            alt="Company Logo"
            className="h-12 w-12 rounded-full object-cover"
          />

          <div className="flex-1 text-center">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">{request.companyName}</span> wants
              to change the role of
              <span className="font-semibold"> {request.userName}</span>
            </p>
          </div>

          <img
            src={request.userPhoto ?? "/assets/images/profile.png"}
            alt="User Profile"
            className="h-12 w-12 rounded-full object-cover"
          />
        </div>

        {/* Role Change Flow */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <p className="font-medium text-gray-700">{request.currentType}</p>
          </div>

          <div className="flex items-center">
            <ArrowRightIcon className="h-6 w-6 text-gray-400" />
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <UserIcon className="h-6 w-6 text-green-600" />
            </div>
            <p className="font-medium text-gray-700">{request.requestedType}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button
            variant="default"
            className="bg-green-500 hover:bg-green-600"
            onClick={() => handleAction("approved")}
          >
            Approve
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleAction("rejected")}
          >
            Reject
          </Button>
        </div>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action === "approved" ? "Approve Request" : "Reject Request"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {action === "approved" ? "approve" : "reject"} this role change
              request?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              Confirm {action === "approved" ? "Approval" : "Rejection"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const RoleChangeRequests = () => {
  const { data: requests, isLoading } =
    api.admin.getPendingRoleChangeRequests.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-xl font-semibold text-gray-700">
        Pending Role Change Requests ({requests?.length ?? 0})
      </h3>
      <div className="space-y-4">
        {requests?.map((request) => (
          <RoleChangeCard key={request.id} request={request} />
        ))}
        {requests?.length === 0 && (
          <div className="text-center text-gray-500">
            No pending role change requests
          </div>
        )}
      </div>
    </div>
  );
};
